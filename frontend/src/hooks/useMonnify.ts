"use client";

import { useEffect, useState } from "react";

declare global {
    interface Window {
        MonnifySDK: any;
    }
}

interface MonnifyProps {
    amount: number;
    customerName: string;
    customerEmail: string;
    reference: string;
    onSuccess?: (response: any) => void;
    onClose?: (data: any) => void;
}

export const useMonnify = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.monnify.com/plugin/monnify.js";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        document.body.appendChild(script);

        return () => {
            const scripts = document.querySelectorAll('script[src="https://sdk.monnify.com/plugin/monnify.js"]');
            scripts.forEach(s => s.remove());
        };
    }, []);

    const initializePayment = ({
        amount,
        customerName,
        customerEmail,
        reference,
        onSuccess,
        onClose
    }: MonnifyProps) => {
        if (!isLoaded || !window.MonnifySDK) {
            console.error("Monnify SDK not loaded");
            return;
        }

        window.MonnifySDK.initialize({
            amount,
            currency: "NGN",
            reference,
            customerFullName: customerName,
            customerEmail: customerEmail,
            apiKey: process.env.NEXT_PUBLIC_MONNIFY_API_KEY,
            contractCode: process.env.NEXT_PUBLIC_MONNIFY_CONTRACT_CODE,
            paymentDescription: "Payment for Pacesetters Services",
            metadata: {
                name: customerName,
            },
            onLoadStart: () => {
                console.log("Monnify load started");
            },
            onLoadComplete: () => {
                console.log("Monnify load complete");
            },
            onComplete: (response: any) => {
                // response will be sent to the callback function
                if (onSuccess) onSuccess(response);
            },
            onClose: (data: any) => {
                // data will be sent to the callback function
                if (onClose) onClose(data);
            }
        });
    };

    return { initializePayment, isLoaded };
};
