'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn, SubmitHandler, FieldValues, DefaultValues, Path } from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants"
import ImageUpload from "./imageUpload";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ type, schema, defaultValues, onSubmit }: Props<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);
    if (result.error) {
      // Ideally show a toast or form error
      // For now, perhaps we can set a root error or just log it if no UI for generic errors exists
      // Or assuming the onSubmit handles the specific field errors mapping if needed
      alert(result.error); // Fallback for visibility
    }
  };

  const isSignIn = type === "SIGN_IN";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-white">
        {isSignIn ? "Welcome back to BookWise" : "Create your library account"}
      </h1>
      <p className="text-light-100">
        {isSignIn
          ? "Access the vast collection of resources, and stay updated"
          : "Please complete all fields and upload a valid university ID to gain access to the library"}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full">
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field === "universityCard" ? (
                      <ImageUpload onFileChange={fieldProps.onChange} />
                    ) : (
                      <Input
                        required
                        type={FIELD_TYPES[field as keyof typeof FIELD_TYPES]}
                        {...fieldProps}
                        className="form-input"
                      />
                    )}


                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            {isSignIn ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Form>
      <p className="text-center text-base font-medium">
        {isSignIn ? "New to BookWise? " : "Already have an account? "}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-bold text-primary"
        >
          {isSignIn ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
