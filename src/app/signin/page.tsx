import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { providerMap, signIn } from "@/auth";
import { SignIn } from "@/components/sign-in";

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined };
}) {
  return (
    <div className="bg-white  text-black">
      <SignIn />
    </div>
  );
}
