import * as Progress from "@radix-ui/react-progress";
import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/buttons";
import { motion } from "motion/react";
import { useUploads, type Upload } from "../store/uploads";
import { formatBytes } from "../utils/format-bytes";
import { downloadUrl } from "../utils/download-url";

interface UploadWidgetUploadItemProps {
   upload: Upload;
   uploadId: string;
}

export function UploadWidgetUploadItem({
   upload,
   uploadId,
}: UploadWidgetUploadItemProps) {
   const cancelUpload = useUploads(store => store.cancelUpload);
   const retryUpload = useUploads(store => store.retryUpload);

   const progress = Math.min(
      upload.compressedSizeInBytes
         ? Math.round((upload.uploadSizeInBytes * 100) / upload.compressedSizeInBytes)
         : 0,
      100,
   );

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.4 }}
         className="p-3 rounded-lg flex flex-col gap-3 shadow-lg bg-white/2 relative overflow-hidden"
      >
         <div className="flex flex-col gap-1">
            <span className="text-xs font-medium flex items-center gap-1">
               <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
               <span className="max-w-[180px] truncate">{upload.name}</span>
            </span>

            <span className="text-xs text-zinc-400 flex gap-1.5 items-center">
               <span className="line-through">{formatBytes(upload.originalSizeInBytes)}</span>
               <div className="size-1 rounded-full bg-zinc-700" />
               <span className="flex items-center gap-1">
                  {formatBytes(upload.compressedSizeInBytes ?? 0)}
                  {upload.compressedSizeInBytes && (
                     <span className="ml-1 text-green-400">
                        -{Math.round((upload.originalSizeInBytes - (upload.compressedSizeInBytes)) * 100 / upload.originalSizeInBytes)}%
                     </span>
                  )}

                  <div className="size-1 rounded-full bg-zinc-700" />

                  {upload.status === "success" && <span className="">100%</span>}
                  {upload.status === "progress" && <span>{progress}%</span>}
                  {upload.status === "error" && <span className="text-red-400">Error</span>}
                  {upload.status === "canceled" && <span className="text-yellow-400">Canceled</span>}

               </span>
            </span>
         </div>

         <Progress.Root
            value={progress}
            data-status={upload.status}
            className="group bg-zinc-800 rounded-full h-1 overflow-hidden"
         >
            <Progress.Indicator
               className="h-1 bg-indigo-500 group-data-[status=success]:bg-green-400 group-data-[status=error]:bg-red-400 group-data-[status=canceled]:bg-yellow-400 transition-all"
               style={{ width: upload.status === "progress" ? `${progress}%` : `100%` }}
            />
         </Progress.Root>

         <div className="absolute top-2 right-2 flex items-center gap-1">
            <Button
               aria-disabled={!upload.remoteUrl}
               className="cursor-pointer disabled:cursor-default disabled:hover:bg-transparent"
               size="icon-sm"
               onClick={() => {
                  if (upload.remoteUrl) {
                     downloadUrl(upload.remoteUrl);
                  }
               }}
            >
               <Download className="size-4" strokeWidth={1.5} />
               <span className="sr-only">Download compressed image</span>
            </Button>

            <Button
               disabled={!upload.remoteUrl}
               className="cursor-pointer disabled:cursor-default disabled:hover:bg-transparent"
               onClick={() => {
                  upload.remoteUrl && navigator.clipboard.writeText(upload.remoteUrl);
               }}
               size="icon-sm"
            >
               <Link2 className="size-4" strokeWidth={1.5} />
               <span className="sr-only">Copy remote URL</span>
            </Button>

            <Button
               disabled={!["canceled", "error"].includes(upload.status)}
               className="cursor-pointer disabled:cursor-default disabled:hover:bg-transparent"
               size="icon-sm"
               onClick={() => retryUpload(uploadId)}
            >
               <RefreshCcw className="size-4" strokeWidth={1.5} />
               <span className="sr-only">Retry compression</span>
            </Button>

            <Button
               disabled={upload.status !== "progress"}
               className="cursor-pointer disabled:cursor-default disabled:hover:bg-transparent"
               size="icon-sm"
               onClick={() => cancelUpload(uploadId)}
            >
               <X className="size-4" strokeWidth={1.5} />
               <span className="sr-only">Cancel compression</span>
            </Button>
         </div>
      </motion.div>
   )
}