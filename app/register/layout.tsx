const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-slate-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark:bg-slate-800">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default RegisterLayout;
