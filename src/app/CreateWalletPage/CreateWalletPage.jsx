//@flow
import React from 'react'
import { Redirect } from 'react-router-dom'
import aes from 'crypto-js/aes'
import { utils } from 'ethers'
import { shuffleArray, validatePassword } from '../../utils/helpers'
import { createWalletFromMnemonic } from '../../store/services/wallet'
import CreateWalletPageRenderer from './CreateWalletPageRenderer'

type Props = {
  visible: boolean,
  hideModal: void => void,
  walletCreated: Object => void
}

type State = {
  currentStep: number,
  password: string,
  passwordStatus: string,
  confirmPassword: string,
  confirmPasswordStatus: string,
  wallet: Object,
  encryptedPrivateKey: string,
  storeWallet: boolean,
  showPassword: boolean,
  showConfirmPassword: boolean,
  storeAccount: boolean,
}

class CreateWalletPage extends React.PureComponent<Props, State> {
  state = {
    currentStep: 1, // We skip step 0 because it seems redundant
    password: '',
    passwordStatus: 'initial',
    confirmPassword: '',
    confirmPasswordStatus: 'initial',
    encryptedPrivateKey: '',
    showPassword: false,
    showConfirmPassword: false,
    shuffedMnemonic: [],
    inputMnemonic: [],
    mnemonicErrorMessage: '',
    wallet: null,
    isOpenPrivateKeyDialog: false,
    storeAccount: false,
  }

  componentDidMount = async () => {
    const mnemonic = utils.HDNode.entropyToMnemonic(utils.randomBytes(16))
    const { wallet } = await createWalletFromMnemonic(mnemonic)
    const shuffedMnemonic = shuffleArray(wallet.mnemonic.split(' '))
    
    this.setState({ wallet, shuffedMnemonic  })
  }

  changeCurrentStep = (currentStep: number) => {
    if (currentStep === 5) {
      const { wallet: { mnemonic }} = this.state

      return this.setState({
        inputMnemonic: [],
        shuffedMnemonic: shuffleArray(mnemonic.split(' ')),
        mnemonicErrorMessage: '',
        currentStep,
      })
    }

    this.setState({currentStep})
  }

  goToPasswordStep = () => {
    this.changeCurrentStep(1)
  }

  goToBackupStep = async () => {
    const { wallet : { privateKey }, password, passwordStatus, confirmPasswordStatus } = this.state

    if (passwordStatus !== 'valid' || confirmPasswordStatus !== 'valid') return

    // Todo: need decrypt privateKey where use it from sessionStorage
    const encryptedPrivateKey = aes.encrypt(privateKey, password).toString()
    this.setState({ encryptedPrivateKey })
    this.changeCurrentStep(2)
  }

  goToWarningStep = () => {
    this.changeCurrentStep(3)
  }

  goToMnemonicStep = () => {
    this.changeCurrentStep(4)
  }

  goToConfirmMnemonicStep = () => {
    this.changeCurrentStep(5)
  }

  goBackToPreviousStep = () => {
    const { currentStep } = this.state
    const prevStep = ((currentStep - 1) > 0) ? (currentStep - 1) : 0 

    this.changeCurrentStep(prevStep)
  }

  complete = () => {
    const { loginWithWallet } = this.props
    const { wallet, password } = this.state

    loginWithWallet(wallet, password)
  }

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    })
  }

  handleChooseMnemonic = (word) => {
    let { inputMnemonic, shuffedMnemonic } = this.state
    inputMnemonic = [...inputMnemonic, word]
    const index = shuffedMnemonic.indexOf(word)
    shuffedMnemonic = [...shuffedMnemonic.slice(0, index), ...shuffedMnemonic.slice(index + 1)]
    this.checkMnemonic(inputMnemonic)

    this.setState({
      inputMnemonic,
      shuffedMnemonic,
    })
  }

  handleRemoveMnemonic = (word) => {
    let { inputMnemonic, shuffedMnemonic } = this.state
    shuffedMnemonic = [...shuffedMnemonic, word]
    const index = inputMnemonic.indexOf(word)
    inputMnemonic = [...inputMnemonic.slice(0, index), ...inputMnemonic.slice(index + 1)]
    this.checkMnemonic(inputMnemonic)

    this.setState({
      inputMnemonic,
      shuffedMnemonic,
    })
  }

  checkMnemonic = (inputMnemonic) => {
    const { mnemonic } = this.state.wallet
    const inputMnemonicString = inputMnemonic.join(' ')
    const index = mnemonic.indexOf(inputMnemonicString)

    if (index !== 0) {
      this.setState({
        mnemonicErrorMessage: 'Incorrect Mnemonic Phrase order. Please try again.',
      })

      return false
    }

    if (index === 0) {
      this.setState({
        mnemonicErrorMessage: '',
      })
    }
    
    if (index === 0 && mnemonic.length === inputMnemonicString.length) {
      return true
    }
  }

  notifyCopiedSuccess = () => {
    this.props.copyDataSuccess()
  }

  togglePrivateKeyDialog = (status) => {
    (status === 'open') ? this.setState({ isOpenPrivateKeyDialog: true }) : this.setState({ isOpenPrivateKeyDialog: false })
  }

  togglePassword = (type) =>  {
    if (type === 'confirm') {
      this.setState({ showConfirmPassword: !this.state.showConfirmPassword })
      return
    }

    this.setState({ showPassword: !this.state.showPassword })
  }

  handlePasswordChange = (e) => {
    const password = e.target.value

    if (!validatePassword(password)) {
      this.setState({ 
        passwordStatus: 'invalid',
        password,
      })

      return
    }

    this.setState({ 
      passwordStatus: 'valid',
      password,
    })
  }

  handleConfirmPasswordChange = (e) => {
    const { password } = this.state
    const confirmPassword = e.target.value

    if (confirmPassword !== password) {
      this.setState({ 
        confirmPasswordStatus: 'invalid',
        confirmPassword,
      })

      return
    }

    this.setState({ 
      confirmPasswordStatus: 'valid',
      confirmPassword,
    })
  }

  handleChangeStoreAccount = (e) => {
    e.target.checked ? this.setState({ storeAccount: true }) : this.setState({ storeAccount: false })
  }
  
  render() {
    const { visible, hideModal, authenticated } = this.props

    if (authenticated) {
      return <Redirect to="/markets" />
    }

    const {
      currentStep,
      password,
      passwordStatus,
      showPassword,
      showConfirmPassword,
      shuffedMnemonic,
      mnemonicErrorMessage,
      inputMnemonic,
      wallet,
      isOpenPrivateKeyDialog,
      confirmPassword,
      confirmPasswordStatus,
      storeAccount,
    } = this.state

    const mnemonic = wallet ? wallet.mnemonic.split(' ') : []
    const address = wallet ? wallet.address : ''
    const privateKey = wallet ? wallet.privateKey : ''

    return (
      <CreateWalletPageRenderer
        visible={visible}
        hideModal={hideModal}
        currentStep={currentStep}
        address={address}
        password={password}
        complete={this.complete}
        mnemonic={mnemonic}
        shuffedMnemonic={shuffedMnemonic}
        inputMnemonic={inputMnemonic}
        goToPasswordStep={this.goToPasswordStep}
        goToBackupStep={this.goToBackupStep}
        goToWarningStep={this.goToWarningStep}
        goToMnemonicStep={this.goToMnemonicStep}
        goToConfirmMnemonicStep={this.goToConfirmMnemonicStep}
        goBackToPreviousStep={this.goBackToPreviousStep}
        handleChooseMnemonic={this.handleChooseMnemonic}
        handleRemoveMnemonic={this.handleRemoveMnemonic}
        mnemonicErrorMessage={mnemonicErrorMessage}
        notifyCopiedSuccess={this.notifyCopiedSuccess}
        togglePrivateKeyDialog={this.togglePrivateKeyDialog}
        isOpenPrivateKeyDialog={isOpenPrivateKeyDialog}
        privateKey={privateKey}
        passwordStatus={passwordStatus}
        showPassword={showPassword}
        togglePassword={this.togglePassword}
        handlePasswordChange={this.handlePasswordChange}
        showConfirmPassword={showConfirmPassword}
        confirmPassword={confirmPassword}
        confirmPasswordStatus={confirmPasswordStatus}
        handleConfirmPasswordChange={this.handleConfirmPasswordChange}
        storeAccount={storeAccount}
        handleChangeStoreAccount={this.handleChangeStoreAccount}
      />
    )
  }
}

export default CreateWalletPage
