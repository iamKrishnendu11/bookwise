"use client";

import { IKImage, IKContext, IKUpload, IKVideo } from "imagekitio-react";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const {
    env: {
        imagekit: { publicKey, urlEndpoint },
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`/api/auth/imagekit`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`
            );
        }

        const data = await response.json();

        const { signature, expire, token } = data;

        return { token, expire, signature };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

interface Props {
    onFileChange: (filePath: string) => void;
}

const ImageUpload = ({
    onFileChange,
}: Props) => {
    const ikUploadRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: null,
    });
    const [progress, setProgress] = useState(0);

    const styles = {
        button: "bg-dark-300",
        placeholder: "text-light-100",
        text: "text-light-100",
    };

    const onError = (error: any) => {
        console.log(error);
        alert("Image upload failed. Please try again.");
    };

    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);
        alert("Image uploaded successfully!");
    };

    const onValidate = (file: File) => {
        if (file.size > 20 * 1024 * 1024) {
            alert("File size too large. Please upload a file that is less than 20MB in size");
            return false;
        }
        return true;
    };

    return (
        <IKContext
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                validateFile={onValidate}
                onUploadStart={() => setProgress(0)}
                onUploadProgress={({ loaded, total }: { loaded: number; total: number }) => {
                    const percent = Math.round((loaded / total) * 100);

                    setProgress(percent);
                }}
                folder="/ids"
                accept="image/*"
                className="hidden"
            />

            <button
                className={cn("upload-btn", styles.button)}
                onClick={(e) => {
                    e.preventDefault();

                    if (ikUploadRef.current) {
                        ikUploadRef.current?.click();
                    }
                }}
            >
                <Image
                    src="/icons/upload.svg"
                    alt="upload-icon"
                    width={20}
                    height={20}
                    className="object-contain"
                />

                <p className={cn("text-base", styles.placeholder)}>Upload ID</p>

                {file.filePath && (
                    <p className={cn("upload-filename", styles.text)}>{file.filePath}</p>
                )}
            </button>

            {progress > 0 && progress !== 100 && (
                <div className="w-full rounded-full bg-green-200">
                    <div className="progress" style={{ width: `${progress}%` }}>
                        {progress}%
                    </div>
                </div>
            )}

            {file.filePath && (
                <IKImage
                    alt={file.filePath}
                    path={file.filePath}
                    width={500}
                    height={300}
                />
            )}
        </IKContext>
    );
};

export default ImageUpload;