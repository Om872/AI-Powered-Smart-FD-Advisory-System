import DashboardShell from '../components/DashboardShell'
import CustomerForm from '../components/CustomerForm'

function CustomerInputPage() {
  return (
    <DashboardShell
      title="Customer Intake Profile"
      subtitle="Input customer financial metrics. AI prediction models will analyze this data for personalized recommendations."
    >
      <div className="max-w-3xl">
        <CustomerForm />
      </div>
    </DashboardShell>
  )
}

export default CustomerInputPage
