// @flow
import React from 'react'
import WalletPageRenderer from './WalletPageRenderer'
import { Redirect } from 'react-router-dom'

import type { TokenData } from '../../types/tokens'

type Props = {
  connected: boolean,
  accountAddress: string,
  tomoBalance: string,
  gasPrice: number,
  gas: number,
  authenticated: boolean,
  redirectToTradingPage: string => void,
  openConnection: void => void,
  tokenData: Array<TokenData>,
  baseTokens: Array<string>,
  quoteTokens: Array<string>,
  balancesLoading: boolean,
  mode: String,
}

class WalletPage extends React.PureComponent<Props> {

  render() {
    const {
      connected,
      authenticated,
      accountAddress,
      tomoBalance,
      gasPrice,
      gas,
      redirectToTradingPage,
      tokenData,
      quoteTokens,
      baseTokens,
      balancesLoading,
      copyDataSuccess,
      mode,
    } = this.props

    if (!authenticated) return <Redirect to="/unlock" />

    const isHelpModalOpen = false

    return (
      <WalletPageRenderer
        gas={gas}
        gasPrice={gasPrice}
        tomoBalance={tomoBalance}
        tokenData={tokenData}
        baseTokens={baseTokens}
        quoteTokens={quoteTokens}
        connected={connected}
        accountAddress={accountAddress}
        balancesLoading={balancesLoading}
        redirectToTradingPage={redirectToTradingPage}
        isHelpModalOpen={isHelpModalOpen}
        copyDataSuccess={copyDataSuccess}
        mode={mode}
      />
    )
  }
}

export default WalletPage
