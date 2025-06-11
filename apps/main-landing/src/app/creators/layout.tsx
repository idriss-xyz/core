import { AuthProvider } from './context/auth-context';

export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
