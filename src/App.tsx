import React, { Suspense, useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import HeaderInfo from './components/HeaderInfo/index'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminApp from './admin-pages/AdminApp'
import { useQuery } from '@tanstack/react-query'
import axios from './utils/axios'
import { IntlProvider } from 'react-intl'
import { useRecoilState } from 'recoil'
import { languageAtom, userAtom } from 'utils/recoil/atoms'
import { ConfigProvider, message } from 'antd'
import tranlsations from './translations'

// arabic
import locale from 'antd/es/locale/ar_EG'
import { IUser } from 'types'

const HomePage = React.lazy(() => import('./pages/HomePage'))
const ChooseYearMonth = React.lazy(() => import('./pages/ChooseYearMonth'))
const ViewNewsPaper = React.lazy(() => import('./pages/ViewNewsPaper'))
const Calendar = React.lazy(() => import('./pages/Calendar'))
const About = React.lazy(() => import('./pages/About'))
const LearnAndSupport = React.lazy(() => import('./pages/LearnAndSupport'));
const ContactUs = React.lazy(() => import('./pages/ContactUs'))
const EditEntity = React.lazy(() => import('./pages/EditEntity'))
const DocumentsListView = React.lazy(() => import('./pages/DocumentsListView'))
const UserSignin = React.lazy(() => import('./user-pages/Signin'))
const ForgotPassword = React.lazy(() => import('./user-pages/ForgotPassword'))
const AddUser = React.lazy(() => import('./user-pages/AddUser'))
const ResetPassword = React.lazy(() => import('./user-pages/ResetPassword'))
const Editor = React.lazy(() => import('./pages/Editor'))

function App() {
  const [user, setUser] = useRecoilState(userAtom)
  const [languageObj, setLanguage] = useRecoilState(languageAtom)

  const { data } = useQuery(
    ['user'],
    async () => {
      const res = await axios.get('/user')
      return res.data
    },
    {
      onSuccess: (data) => {
        if (data?.success) {
          setUser(data.user)
        } else {
          setUser({} as IUser)
        }
      }
    }
  )

  useEffect(() => {
    // check local storage for language, if not found set it to 'en'
    const lang = localStorage.getItem('language') || 'en'

    if (lang === 'ar') {
      setLanguage({
        language: 'ar',
        isRtl: true
      })
    }

    if (lang === 'en') {
      setLanguage({
        language: 'en',
        isRtl: false
      })
    }
  }, [])

  if (!data) {
    return null
  }

  if (window.location.pathname.indexOf('/a/admin') === 0) {
    return (
      <div
        className="App"
        style={{
          direction: languageObj.isRtl ? 'rtl' : 'ltr'
        }}
      >
        <IntlProvider locale={languageObj.language} messages={tranlsations[languageObj.language]}>
          <ConfigProvider direction="ltr">
            <Suspense fallback={<div>...تحميل</div>}>
              <Router basename="/a/admin">
                <AdminApp />
              </Router>
            </Suspense>
          </ConfigProvider>
        </IntlProvider>
      </div>
    )
  }

  return (
    <div
      className="App"
      style={{
        direction: languageObj.isRtl ? 'rtl' : 'ltr'
      }}
    >
      <IntlProvider locale={languageObj.language} messages={tranlsations[languageObj.language]}>
        <ConfigProvider direction="rtl" locale={locale}>
          <Router>
            <Suspense fallback={<div>...تحميل</div>}>
              <HeaderInfo />
              <NavBar />
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route path="/choose/year-month/:categoryId" component={ChooseYearMonth} />
                <Route path="/list/:categoryId" component={DocumentsListView} />
                <Route path="/view/newspaper/:id" component={ViewNewsPaper} />
                <ProtectedRoute admin={false} path="/edit/newspaper/:id" component={EditEntity} />
                <Route path="/calendar/:categoryId/:year/:month" component={Calendar} />
                <Route path="/about" component={About} />
                <Route path="/learn-and-support" component={LearnAndSupport} />
                <Route path="/contact-us" component={ContactUs} />
                <Route path="/user-signin">
                  <UserSignin />
                </Route>
                <Route path="/user-add" component={AddUser} />
                <Route path="/forget-password" component={ForgotPassword} />
                <Route path="/reset-password/:token" component={ResetPassword} />
                <Route path="/editor" component={Editor} />
                {/* A not found component needed here */}
                {/* <Route  component={NotFound} /> */}
              </Switch>
            </Suspense>
          </Router>
        </ConfigProvider>
      </IntlProvider>
    </div>
  )
}

export default App
