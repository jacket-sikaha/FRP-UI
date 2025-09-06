import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export function SignIn() {
  return (
    <form
      className="flex flex-col gap-4"
      action={async (formData) => {
        "use server";
        try {
          const res = await signIn("credentials", formData);
          alert(res);
        } catch (error) {
          if (error instanceof AuthError) {
            return redirect(`/error?error=${error.type}`);
          }
          throw error;
        }
      }}
    >
      <label>
        username
        <input name="username" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
