interface WelcomeHeaderProps {
  name?: string | null;
}

export function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const displayName = name;
  return (
    <div className="space-y-1 px-1">
      <h1 className="text-xl sm:text-3xl md:text-4xl text-green-950 font-bold tracking-tight leading-tight">
        Welcome back, {displayName}!
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground mt-1">
        Manage your solar system and payments
      </p>
    </div>
  );
}
