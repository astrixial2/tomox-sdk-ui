import React, { Suspense, lazy } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { ConnectedRouter } from 'connected-react-router'
import history from '../store/history'
import '../styles/css/index.css'

import appSelector from '../store/models/app'
import { Centered, Loading, DarkMode, LightMode } from '../components/Common'

const Layout = lazy(_ => import('./Layout'))
const LoginPage = lazy(_ => import('./LoginPage'))
const CreateWalletPage = lazy(_ => import('./CreateWalletPage'))
const WalletPage = lazy(_ => import('./WalletPage'))
const LogoutPage = lazy(_ => import('./LogoutPage'))
const TradingPage = lazy(_ => import('./TradingPage'))
const MarketsPage = lazy(_ => import('./MarketsPage'))
const Dapp = lazy(_ => import('./Dapp'))
const DappTrade = lazy(_ => import('./DappTrade'))
const DappOrders = lazy(_ => import('./DappOrders'))

const theme = {
  dark: DarkMode,
  light: LightMode,
}

class App extends React.PureComponent {
  render() {
    const { mode } = this.props

    return (
      <ConnectedRouter history={history}>
        <ThemeProvider theme={theme[mode]}>
          <Suspense fallback={<Centered><Loading/></Centered>}>
            <Layout>          
              <Switch>
                <Route exact path="/unlock" component={LoginPage} />
                <Route exact path="/wallet" component={WalletPage} />
                <Route exact path="/markets" component={MarketsPage} />
                <Route exact path="/trade/:pair?" component={TradingPage} />                    
                <Route exact path="/logout" component={LogoutPage} />
                <Route exact path="/create" component={CreateWalletPage} />
                <Route exact path="/dapp/orders" component={DappOrders} />
                <Route exact path="/dapp/:pair?" component={Dapp} />               
                <Route exact path="/dapp/trade/:pair?" component={DappTrade} />  
                <Route render={() => <Redirect to="/markets" />} />
              </Switch>          
            </Layout>
          </Suspense>
        </ThemeProvider>
      </ConnectedRouter>
    )
  }
}

const mapStateToProps = (state) => {
  const { location, mode } = appSelector(state)

  return {
    location,
    mode,
  }
}

export default connect(mapStateToProps)(App)
