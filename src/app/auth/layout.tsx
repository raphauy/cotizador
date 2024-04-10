const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
    <div className="w-full flex items-center justify-center h-[calc(100vh-120px)]">
      {children}
    </div>
   );
}
 
export default AuthLayout;