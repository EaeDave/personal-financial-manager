import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      app: {
        title: 'Financial Manager',
      },
      dashboard: {
        viewAccounts: 'View Accounts',
        viewAccountsDesc: 'See all your accounts and balances.',
        viewCreditCards: 'View Credit Cards',
        viewCreditCardsDesc: 'Manage your cards, limits and dates.',
        addBill: 'Add Bill',
        addBillDesc: 'Track a recurring or one-time bill.',
        quickActions: 'Quick Actions',
        newTransaction: 'New Transaction',
        newTransactionDesc: 'Add income or expense to an account.',
        settings: 'Settings',
        dashboard: 'Dashboard',
      },
      common: {
        back: 'Back',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        add: 'Add',
        create: 'Create',
        processing: 'Processing...',
        success: 'Success',
        error: 'Error',
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        currency: 'Currency',
        currencyFormat: 'Currency Format',
        portuguese: 'Português (Brasil)',
        english: 'English',
      },
      accounts: {
        title: 'Accounts',
        totalBalance: 'Total Balance',
        noAccounts: 'No accounts yet',
        noAccountsDesc: 'Get started by creating your first account.',
        addAccount: 'Add Account',
        desc: 'Enter account details below.',
        form: {
          name: 'Name',
          type: 'Type',
          initialBalance: 'Initial Balance',
        },
        types: {
          checking: 'Checking',
          savings: 'Savings',
          investment: 'Investment',
          cash: 'Cash',
        },
      },
      transactions: {
        title: 'New Transaction',
        history: 'Transaction History',
        noTransactions: 'No transactions found for this account.',
        description: 'New Transaction',
        desc: 'Record a new income or expense.',
        form: {
          description: 'Description',
          descriptionPlaceholder: 'Uber, Grocery, Salary...',
          amount: 'Amount',
          type: 'Type',
          account: 'Account',
          selectType: 'Select type',
          selectAccount: 'Select account',
          expense: 'Expense',
          income: 'Income',
          submit: 'Create Transaction',
        },
      },
      cards: {
        title: 'Credit Cards',
        desc: 'Enter card details.',
        noCards: 'No credit cards yet',
        noCardsDesc: 'Start by adding your first credit card.',
        addCard: 'Add Card',
        limit: 'Limit',
        closing: 'Closing',
        dueDate: 'Due Date',
        day: 'Day',
      },
      bills: {
        created: 'Bill created',
      },
    },
  },
  pt: {
    translation: {
      app: {
        title: 'Gestor Financeiro',
      },
      dashboard: {
        viewAccounts: 'Ver Contas',
        viewAccountsDesc: 'Veja todas as suas contas e saldos.',
        viewCreditCards: 'Ver Cartões',
        viewCreditCardsDesc: 'Gerencie seus cartões, limites e datas.',
        addBill: 'Adicionar Conta',
        addBillDesc: 'Monitore uma conta recorrente ou única.',
        quickActions: 'Ações Rápidas',
        newTransaction: 'Nova Transação',
        newTransactionDesc: 'Adicione receita ou despesa a uma conta.',
        settings: 'Configurações',
        dashboard: 'Painel',
      },
      common: {
        back: 'Voltar',
        loading: 'Carregando...',
        save: 'Salvar',
        cancel: 'Cancelar',
        add: 'Adicionar',
        create: 'Criar',
        processing: 'Processando...',
        success: 'Sucesso',
        error: 'Erro',
        notFound: 'Não encontrado',
        accountNotFound: 'Conta não encontrada.',
      },
      settings: {
        title: 'Configurações',
        language: 'Idioma',
        currency: 'Moeda',
        currencyFormat: 'Formato de Moeda',
        portuguese: 'Português (Brasil)',
        english: 'English',
      },
      accounts: {
        title: 'Contas',
        totalBalance: 'Saldo Total',
        noAccounts: 'Nenhuma conta ainda',
        noAccountsDesc: 'Comece criando sua primeira conta.',
        addAccount: 'Adicionar Conta',
        desc: 'Insira os detalhes da conta abaixo.',
        form: {
          name: 'Nome',
          type: 'Tipo',
          initialBalance: 'Saldo Inicial',
        },
        types: {
          checking: 'Corrente',
          savings: 'Poupança',
          investment: 'Investimento',
          cash: 'Dinheiro',
        },
      },
      transactions: {
        title: 'Nova Transação',
        history: 'Histórico de Transações',
        noTransactions: 'Nenhuma transação encontrada para esta conta.',
        description: 'Nova Transação',
        desc: 'Registre uma nova receita ou despesa.',
        form: {
          description: 'Descrição',
          descriptionPlaceholder: 'Uber, Mercado, Salário...',
          amount: 'Valor',
          type: 'Tipo',
          account: 'Conta',
          selectType: 'Selecione o tipo',
          selectAccount: 'Selecione a conta',
          expense: 'Despesa',
          income: 'Receita',
          submit: 'Criar Transação',
        },
      },
      cards: {
        title: 'Cartões de Crédito',
        desc: 'Insira os detalhes do cartão.',
        noCards: 'Nenhum cartão ainda',
        noCardsDesc: 'Comece adicionando seu primeiro cartão.',
        addCard: 'Adicionar Cartão',
        limit: 'Limite',
        closing: 'Fechamento',
        dueDate: 'Vencimento',
        day: 'Dia',
      },
      bills: {
        created: 'Conta criada',
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
