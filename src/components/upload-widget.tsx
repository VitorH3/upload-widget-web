import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";
import { motion, useCycle } from "motion/react";
import { usePendingUploads } from "../store/uploads";

export function UploadWidget() {
   const { isThereAnyPendingUploads } = usePendingUploads();

   // const [isWidgetOpen, toggleWidgetOpen] = useCycle(false, true);
   const [isWidgetOpen, toggleWidgetOpen] = useCycle(true, false);

   return (
      // <Collapsible.Root onOpenChange={() => toggleWidgetOpen()} asChild>
      <Collapsible.Root defaultOpen onOpenChange={() => toggleWidgetOpen()} asChild>
         <motion.div
            data-progress={isThereAnyPendingUploads}
            className="bg-zinc-900 max-w-[360px] overflow-hidden rounded-xl shadow-2xl border border-transparent animate-border data-[state=closed]:rounded-3xl data-[state=closed]:data-[progress=false]:shadow-shape data-[state=closed]:data-[progress=true]:[background:linear-gradient(to_bottom,rgba(95, 2, 245, 0.02),rgba(118, 3, 250, 0.01))]"
            animate={isWidgetOpen ? "open" : "closed"}
            variants={{
               closed: {
                  width: "max-content",
                  height: 44,
                  transition: {
                     type: "inertia",
                  }
               },
               open: {
                  width: 360,
                  height: "auto",
                  transition: {
                     duration: 0.1,
                  }
               }
            }}
         >
            {!isWidgetOpen && <UploadWidgetMinimizedButton />}

            <Collapsible.Content>
               <UploadWidgetHeader />

               <div className="flex flex-col gap-4 py-3">
                  <UploadWidgetDropzone />

                  <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

                  <UploadWidgetUploadList />
               </div>
            </Collapsible.Content>
         </motion.div>
      </Collapsible.Root>
   )
}