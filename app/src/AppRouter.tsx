import { FC, PropsWithChildren, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CBox, Home } from './pages'
import { Navbar } from './components'

type PageWrapperProps = {}

const PageWrapper: FC<PropsWithChildren<PageWrapperProps>> = ({children}) => {
    return (
        <section className={'content'}>
            <Navbar/>
            {children}
        </section>
    )
}

const AppRouter: FC = () => {
    
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            left: 0,
            top: 0
        })
    }, [pathname])

    return (
    <>
      <section className='page'>
            <Routes>
                <Route path='/' element={<PageWrapper><Home/></PageWrapper>}/>
                <Route path='/cbox/:id' element={<PageWrapper><CBox/></PageWrapper>}/>
                <Route path='*' element={<Navigate to='/'/>}/>
            </Routes>
      </section>
    </>
    )
}

export default AppRouter