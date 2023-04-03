import Image from 'next/image';

const TopBar = () => (
  <div className='flex justify-center'>
    <div className='flex justify-center items-center space-x-2 cursor-pointer' onClick={() => window.open('https://twitter.com/tausani93')}>
      <Image 
        className="rounded-full"
        width={72}
        height={72}
        src='/tausani.jpg'
        alt='Tausani'
      />
      <div className='justify-center items-center'>
        <h1 className='text-sm font-bold font-sans tracking-tight text-white'>
          Tausani
        </h1>
        <h1 className='text-sm font-sans tracking-tight text-white'>
          @tausani93
        </h1>
      </div>
    </div>
  </div>
)

export default TopBar;
