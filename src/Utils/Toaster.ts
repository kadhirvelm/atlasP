import { Intent, Toaster } from "@blueprintjs/core";

let toast: Toaster | undefined;

export function setToast(toastRef: Toaster) {
    toast = toastRef;
}

export function showToast(intent: Intent, message: string) {
    if (toast !== undefined) {
        toast.show({ intent, message });
    }
}