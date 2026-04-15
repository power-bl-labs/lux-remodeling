type SignInFormProps = {
  callbackUrl: string;
  error?: string | null;
  actionUrl: string;
};

export function SignInForm({ callbackUrl, error, actionUrl }: SignInFormProps) {
  return (
    <form action={actionUrl} className="mt-8 grid gap-4" method="post">
      <input name="callbackUrl" type="hidden" value={callbackUrl} />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[#344054]" htmlFor="email">
          Email
        </label>
        <input
          required
          className="h-12 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium outline-none transition focus:border-[var(--brand-blue)]"
          id="email"
          name="email"
          type="email"
          placeholder="admin@luxremodeling.com"
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
          placeholder="Minimum 8 characters"
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
