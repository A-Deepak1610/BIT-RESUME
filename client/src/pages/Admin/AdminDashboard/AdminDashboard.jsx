import Admingraph1 from './adminGraphs/admingraph1';

export default function AdminDashboard() {
  return (
    <div className='p-2.5 w-full flex flex-col justify-center mx-auto '>
      <div className='bg-white shadow-md w-full h-[50vh] flex flex-col rounded-md'>
        <Admingraph1 />
      </div>
    </div>
  );
}