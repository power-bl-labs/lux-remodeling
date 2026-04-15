type SignInFormProps = {
  callbackUrl: string;
  error?: string | null;
  action: (formData: FormData) => void | Promise<void>;
};

export function SignInForm({ callbackUrl, error, action }: SignInFormProps) {
  return (
    <form action={action} className="mt-8 grid gap-4">
      <input name="callbackUrl" type="hidden" value={callbackUrl} />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="login">
          Login
        </label>
        <input
          required
          className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
          id="login"
          name="login"
          type="text"
          defaultValue="admin"
          placeholder="admin"
        />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="password">
          Password
        </label>
        <input
          required
          className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
          id="password"
          name="password"
          type="password"
          placeholder="admin13"
        />
      </div>

      <button
        className="mt-2 inline-flex h-12 items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
      >
        Sign In To Admin
      </button>

      {error ? <p className="text-sm font-medium text-[#b42318]">{error}</p> : null}
    </form>
  );
}
