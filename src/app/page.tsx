import GeneralFeed from "@/components/GeneralFeed";
import LoginDescription from "@/components/LoginDescription";
import { getAuthSession } from "@/lib/auth";
import UserPanelsServer from "@/components/UserPanelsServer";

const MainPage = async () => {
  const session = await getAuthSession();
  return (
    <div className='flex flex-col items-center gap-4'>
      <div className={`w-full flex flex-col md:flex-row gap-4 ${session?.user ? 'md:justify-center' : 'md:justify-start'}`}>
        {session?.user ? <UserPanelsServer userId={session.user.id} /> : <LoginDescription />}
      </div>
      <div className="flex-1 w-full px-3.5 md:px-0">
        <h1 className='font-bold text-foreground text-3xl md:text-4xl'>Your feed</h1>
        {/* {session ? <CustomFeed /> : <GeneralFeed />} TODO: Create custom feed */}
        <GeneralFeed />
      </div>
    </div>
  );
}

export default MainPage;