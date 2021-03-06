// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Button,
  Callout,
  Slider,
  Icon,
  Spinner,
  Checkbox,
} from '@blueprintjs/core'
import { ModalBody, ModalFooter } from '../../Common'
import SmallTxNotification from '../../SmallTxNotification'
import { formatNumber } from 'accounting-js'

type Props = {
  step: string,
  goToFirstStep: void => void,
  goToSecondStep: void => void,
  goToThirdStep: void => void,
  userHasETH: boolean,
  userHasWETH: boolean,
  userHasApprovedWETH: boolean,
  handleConvertETH: void => void,
  handleApproveWETH: void => void,
  TomoBalance: number,
  WETHBalance: number,
  convertAmount: number,
  convertFraction: number,
  changeConvertETHFraction: number => void,
  TOMOAddress: string,
  convertTxStatus: string,
  convertTxHash: string,
  approveTxStatus: string,
  approveTxHash: string,
  showHelpModalChecked: boolean,
  toggleShowHelpModalCheckBox: void => void,
  transactionsPending: boolean,
  transactionsComplete: boolean
};

const NotificationBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 10px;
`

const FooterActionsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const SecondStep = (props: Props) => {
  const {
    goToThirdStep,
    userHasETH,
    userHasWETH,
    userHasApprovedWETH,
    handleConvertETH,
    handleApproveWETH,
    TomoBalance,
    WETHBalance,
    convertAmount,
    convertFraction,
    changeConvertETHFraction,
    TOMOAddress,
    convertTxStatus,
    convertTxHash,
    approveTxStatus,
    approveTxHash,
    showHelpModalChecked,
    toggleShowHelpModalCheckBox,
    transactionsPending,
    transactionsComplete,
  } = props

  if (transactionsPending) {
    return (
      <React.Fragment>
        <ModalBody>
          <IconBox>
            <h2>Your setup is in process and will finish shortly</h2>
          </IconBox>
          <NotificationBox>
            {convertTxHash && (
              <SmallTxNotification
                txName="Conversion Transaction"
                status={convertTxStatus}
                hash={convertTxHash}
              />
            )}
          </NotificationBox>
          <NotificationBox>
            {approveTxHash && (
              <SmallTxNotification
                txName="Approval Transaction"
                status={approveTxStatus}
                hash={approveTxHash}
              />
            )}
          </NotificationBox>
        </ModalBody>
        <ModalFooter>
          <ButtonBox>
            <Button
              intent="primary"
              large
              disabled
              onClick={goToThirdStep}
              text="Continue"
            />
          </ButtonBox>
        </ModalFooter>
      </React.Fragment>
    )
  }

  if (transactionsComplete) {
    return (
      <React.Fragment>
        <ModalBody>
          <IconBox>
            <Icon intent="success" iconSize={150} icon="tick-circle" />
            <h2>Setup complete!</h2>
          </IconBox>
          <NotificationBox>
            {convertTxHash && (
              <SmallTxNotification
                txName="Conversion Transaction"
                status={convertTxStatus}
                hash={convertTxHash}
              />
            )}
          </NotificationBox>
          <NotificationBox>
            {approveTxHash && (
              <SmallTxNotification
                txName="Approval Transaction"
                status={approveTxStatus}
                hash={approveTxHash}
              />
            )}
          </NotificationBox>
        </ModalBody>
        <ModalFooter>
          <ButtonBox>
            <Button
              intent="primary"
              large
              onClick={goToThirdStep}
              text="Continue"
            />
          </ButtonBox>
        </ModalFooter>
      </React.Fragment>
    )
  }

  // if (userHasWETH && userHasApprovedWETH || transactionsComplete) {
  //   return (
  //     <React.Fragment>
  //       <ModalBody>
  //         <IconBox>
  //           <Icon intent='success' iconSize={180} icon='tick-circle' />
  //           <h2>You're all set! Click to continue.</h2>
  //         </IconBox>
  //         <NotificationBox>
  //           {convertTxHash &&
  //             <SmallTxNotification
  //               txName='Conversion Transaction'
  //               status={convertTxStatus}
  //               hash={convertTxHash}
  //             />}
  //         </NotificationBox>
  //         <NotificationBox>
  //           {approveTxHash &&
  //             <SmallTxNotification
  //               txName='Approval Transaction'
  //               status={approveTxStatus}
  //               hash={approveTxHash}
  //             />}
  //         </NotificationBox>
  //       </ModalBody>
  //       <ModalFooter>
  //         <ButtonBox>
  //           <Button intent='primary' large onClick={goToThirdStep} text='Continue' />
  //         </ButtonBox>
  //       </ModalFooter>
  //     </React.Fragment>
  //   )
  // }

  if (userHasETH && !userHasWETH) {
    return (
      <React.Fragment>
        <ModalBody>
          <Callout intent="success" title="Tokenize your TOMO to start trading!">
            <p>
              Wrapped TOMO, or WETH, is a tokenized and tradeable version of
              regular TOMO. TOMO needs to be wrapped to trade with it on
              Paradex. You can convert your WETH back to TOMO anytime. Be sure to
              keep some regular TOMO to pay misc. gas costs. Read more WETH
              (tokenized or 'wrapped') ether here.
            </p>
            <br />
            <p>
              By clicking the convert button, you will trigger two blockchain
              transaction.{' '}
              <Button minimal disabled>
                View FAQ
              </Button>
            </p>
          </Callout>
          <SliderGroup>
            <SliderBox>
              <Slider
                max={100}
                min={0}
                onChange={changeConvertETHFraction}
                value={convertFraction}
                labelStepSize={25}
              />
            </SliderBox>
          </SliderGroup>
          <BalancesGroup>
            <p>Total after transaction:</p>
            <BalancesBox>
              <BalanceBox>
                <h2>
                  {formatNumber(Number(TomoBalance) - convertAmount, {
                    precision: 3,
                  })}{' '}
                  TOMO
                </h2>
              </BalanceBox>
              <BalanceBox>
                <h2>
                  {formatNumber(Number(WETHBalance) + convertAmount, {
                    precision: 3,
                  })}{' '}
                  WETH
                </h2>
              </BalanceBox>
            </BalancesBox>
          </BalancesGroup>
          <br />
        </ModalBody>
        <ModalFooter>
          <FooterBox>
            <Checkbox
              checked={showHelpModalChecked}
              onClick={toggleShowHelpModalCheckBox}
            >
              Do not show again
            </Checkbox>
            <FooterActionsBox>
              <NotificationBox>
                {convertTxHash && (
                  <SmallTxNotification
                    txName="Conversion Transaction"
                    status={convertTxStatus}
                    hash={convertTxHash}
                  />
                )}
              </NotificationBox>
              <NotificationBox>
                {approveTxHash && (
                  <SmallTxNotification
                    txName="Approval Transaction"
                    status={approveTxStatus}
                    hash={approveTxHash}
                  />
                )}
              </NotificationBox>
              <div>
                <Button large onClick={goToThirdStep}>
                  Skip
                </Button>
                <Button
                  large
                  intent="primary"
                  onClick={handleConvertETH}
                  text="Convert TOMO"
                />
              </div>
            </FooterActionsBox>
          </FooterBox>
        </ModalFooter>
      </React.Fragment>
    )
  }

  if (userHasWETH && !userHasApprovedWETH) {
    return (
      <React.Fragment>
        <ModalBody>
          <Callout intent="success" title="Approve ether to start trading">
            You need to grant approval to perform trades to the Tomochain
            exchange. Granting approval does not allow the Tomochain exchange to
            move your funds without your permission.
          </Callout>
        </ModalBody>
        <ModalFooter>
          <FooterBox>
            <Checkbox
              checked={showHelpModalChecked}
              onClick={toggleShowHelpModalCheckBox}
            >
              Do not show again
            </Checkbox>
            <div>
              <Button large onClick={goToThirdStep}>
                Skip
              </Button>
              <Button
                large
                intent="primary"
                onClick={handleApproveWETH}
                text="Approve Trading"
              />
            </div>
          </FooterBox>
        </ModalFooter>
      </React.Fragment>
    )
  }

  if (!userHasETH) {
    return (
      <React.Fragment>
        <ModalBody>
          <Callout intent="success" title="Deposit TOMO">
            Send TOMO$1 to the address displayed below. This form will update once
            we detect your balance has changed.
          </Callout>
          <WaitingFormBox>
            <SpinnerBox>
              <Spinner intent="primary" size={100} />
            </SpinnerBox>
            <Address>{TOMOAddress}</Address>
            <CurrentBalanceBox>
              (Your current balance is {TomoBalance} TOMO)
            </CurrentBalanceBox>
          </WaitingFormBox>
        </ModalBody>
        <ModalFooter>
          <FooterBox>
            <Checkbox
              checked={showHelpModalChecked}
              onClick={toggleShowHelpModalCheckBox}
            >
              Do not show again
            </Checkbox>
            <Button large onClick={goToThirdStep}>
              Skip
            </Button>
          </FooterBox>
        </ModalFooter>
      </React.Fragment>
    )
  }

  // default
  return (
    <React.Fragment>
      <ModalBody>
        <IconBox>
          <Icon intent="success" iconSize={180} icon="tick-circle" />
          <h2>You're all set! Click to continue.</h2>
        </IconBox>
        <NotificationBox>
          {convertTxHash && (
            <SmallTxNotification
              txName="Conversion Transaction"
              status={convertTxStatus}
              hash={convertTxHash}
            />
          )}
        </NotificationBox>
        <NotificationBox>
          {approveTxHash && (
            <SmallTxNotification
              txName="Approval Transaction"
              status={approveTxStatus}
              hash={approveTxHash}
            />
          )}
        </NotificationBox>
      </ModalBody>
      <ModalFooter>
        <ButtonBox>
          <Button
            intent="primary"
            large
            onClick={goToThirdStep}
            text="Continue"
          />
        </ButtonBox>
      </ModalFooter>
    </React.Fragment>
  )
}

const SpinnerBox = styled.div`
  padding-top: 40px;
`

const FooterBox = styled.div`
  width: 100%;
  padding-top: 80px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const IconBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  padding-bottom: 50px;
`

const ButtonBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const WaitingFormBox = styled.div`
  margin: auto;
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  align-items: center;
`

const CurrentBalanceBox = styled.div`
  padding-top: 4px;
`

const Address = styled.div`
  padding-top: 40px;
  font-weight: bold;
`

const SliderGroup = styled.div`
  margin: 40px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
`

const SliderBox = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: row;
  width: 400px;
`

const BalancesGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
`

const BalancesBox = styled.div`
  display: flex;
  width: 80%;
  flex-direction: row;
  justify-content: space-around;
`

const BalanceBox = styled.div`
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default SecondStep
