import {ReactNode} from 'react'
import Header from '@/components/header'

const layout = ({children}: { children: ReactNode }) => {
  return <main className='root-container'>
    <div className='mx-auto max-w-7xl'>
        <Header/>
    <div className="mt-20 pb-20"> {children}</div>

    </div>
  </main>
}

export default layout