import { unzip, type UnzipFileInfo } from "fflate";
import { ElMessage } from "element-plus";
import { translate } from "@toonflow/i18n/vue";
import { getReadableFileMimeType } from "@toonflow/server/documentFormats";

const mediaTypes: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", bmp: "image/bmp", avif: "image/avif", svg: "image/svg+xml",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", m4v: "video/x-m4v", mkv: "video/x-matroska",
};
const maxEntrySize = 100 * 1024 * 1024;
// ACT: 解压前按 ZIP 目录中声明的原始大小限制总量（200 MB），防止压缩炸弹占满内存；声明可被伪造，解压后再逐个复核大小。
const maxTotalSize = 200 * 1024 * 1024;
const maxEntries = 20;
const maxZipSize = 500 * 1024 * 1024;

export const zipAccept = ".zip,application/zip,application/x-zip-compressed";

function isZip(file: File) {
  return /\.zip$/i.test(file.name) || ["application/zip", "application/x-zip-compressed"].includes(file.type);
}

function entryType(name: string) {
  const extension = name.match(/\.([^.\\/]+)$/)?.[1]?.toLowerCase() ?? "";
  return getReadableFileMimeType(name) ?? mediaTypes[extension];
}

function isAcceptedEntry(info: UnzipFileInfo) {
  const name = info.name.replaceAll("\\", "/");
  const base = name.split("/").pop() ?? "";
  return !name.endsWith("/") && !name.startsWith("__MACOSX/") && !base.startsWith(".") && !!entryType(base) && info.originalSize > 0 && info.originalSize <= maxEntrySize;
}

async function extractZip(file: File): Promise<File[]> {
  const data = new Uint8Array(await file.arrayBuffer());
  let declaredTotal = 0;
  let accepted = 0;
  const entries = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
    unzip(data, {
      filter(info) {
        if (!isAcceptedEntry(info) || accepted >= maxEntries || declaredTotal + info.originalSize > maxTotalSize) return false;
        declaredTotal += info.originalSize;
        accepted++;
        return true;
      },
    }, (error, result) => error ? reject(error) : resolve(result));
  });
  return Object.entries(entries)
    .filter(([, bytes]) => bytes.length > 0 && bytes.length <= maxEntrySize)
    .map(([path, bytes]) => {
      const name = path.replaceAll("\\", "/").split("/").pop()!;
      // fflate 解压结果始终基于普通 ArrayBuffer，类型声明为 ArrayBufferLike 只是泛化。
      return new File([bytes as Uint8Array<ArrayBuffer>], name, { type: entryType(name) });
    });
}

/** 将 ZIP 附件展开为其中受支持的图片、视频、文本和文档文件；其他文件原样返回。 */
export async function expandZipAttachments(files: File[]): Promise<File[]> {
  const expanded: File[] = [];
  for (const file of files) {
    if (!isZip(file)) {
      expanded.push(file);
      continue;
    }
    if (file.size > maxZipSize) {
      ElMessage.warning(`${translate("ZIP 文件不能超过 500 MB")}：${file.name}`);
      continue;
    }
    try {
      const entries = await extractZip(file);
      if (!entries.length) ElMessage.warning(`${translate("压缩包中没有可添加的文件")}：${file.name}`);
      expanded.push(...entries);
    } catch (error) {
      console.error("解压 ZIP 附件失败：", error);
      ElMessage.error(`${translate("无法解压 ZIP 文件，可能已损坏或已加密")}：${file.name}`);
    }
  }
  return expanded;
}
