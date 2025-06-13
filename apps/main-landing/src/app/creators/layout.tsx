import { AuthProvider } from './context/auth-context';

// ts-unused-exports:disable-next-line
export default function CreatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
