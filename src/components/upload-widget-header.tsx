import { Minimize2 } from "lucide-react";
import { Button } from "./ui/buttons";
import * as Collapsible from "@radix-ui/react-collapsible";
import { UploadWidgetTitle } from "./upload-widget-title";

export function UploadWidgetHeader() {
    return (
        <div className="w-full p-4 py-2 gb-white/2 border-zinc-800 border-b flex items-center justify-between">
            <UploadWidgetTitle />

            <Collapsible.Trigger asChild>
                <Button size="icon-sm">
                    <Minimize2 strokeWidth={1.5} className="size-4" />
                </Button>
            </Collapsible.Trigger>
        </div>
    )
}