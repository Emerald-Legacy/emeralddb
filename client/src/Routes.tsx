import { Navigate, Route, Routes as RouterRoutes, useNavigate, useLocation } from 'react-router-dom'
import { useCurrentUser } from './providers/UserProvider'
import { AdminView } from './views/AdminView'
import { BuilderView } from './views/BuilderView'
import { CardDetailView } from './views/CardDetailView'
import { CardsView } from './views/CardsView'
import { CreateCardView } from './views/CreateCardView'
import { CreateDeckView } from './views/CreateDeckView'
import { DeckDetailView } from './views/DeckDetailView'
import { DecksView } from './views/DecksView'
import { EditCardView } from './views/EditCardView'
import { EditDeckView } from './views/EditDeckView'
import { EditPackView } from './views/EditPackView'
import { ManageCyclesView } from './views/ManageCyclesView'
import { NotLoggedIn } from './views/NotLoggedIn'
import { NotPermitted } from './views/NotPermitted'
import { FFGRulesReferenceGuide } from './views/FFGRulesReferenceGuide'
import { OpLists } from './views/OpLists'
import { HelpView } from './views/HelpView'
import { EditTraitsView } from './views/EditTraitsView'
import { useEffect } from 'react'
import { EditFormatsView } from "./views/EditFormatsView";
import { ELRulesReferenceGuideNew } from "./views/ELRulesReferenceGuideNew";

const AuthenticatedRoute = (props: { children: JSX.Element }) => {
  const { isLoggedIn } = useCurrentUser()
  return isLoggedIn() ? props.children : <NotLoggedIn />
}

const DataAdminRoute = (props: { children: JSX.Element }) => {
  const { isDataAdmin } = useCurrentUser()
  return isDataAdmin() ? props.children : <NotPermitted />
}

export function Routes(): JSX.Element {
  const location = useLocation()
  useEffect(() => {
    const host = window.location.host
    const prefix = host.includes('localhost') ? 'LOCAL' : host.includes('beta-') ? 'BETA' : ''
    const title = `${prefix} EmeraldDB`
    document.title = title
  }, [location])
  return (
    <RouterRoutes>
      <Route path="/cards" element={<CardsView />} />
      <Route path="/rules/imperial" element={<FFGRulesReferenceGuide />} />
      <Route path="/rules/emerald" element={<ELRulesReferenceGuideNew />} />
      <Route path="/rules/organized-play/:format" element={<OpLists />} />
      <Route path="/rules/organized-play" element={<OpLists />} />
      <Route path="/rules" element={<Navigate to="/rules/emerald" replace />} />
      <Route path="/faq" element={<HelpView />} />
      <Route path="/decks/:id" element={<DeckDetailView />} />
      <Route path="/decks" element={<DecksView />} />
      <Route path="/builder/create/new" element={<AuthenticatedRoute><CreateDeckView /></AuthenticatedRoute>} />
      <Route path="/builder/:id/edit" element={<AuthenticatedRoute><EditDeckView /></AuthenticatedRoute>} />
      <Route path="/builder" element={<AuthenticatedRoute><BuilderView /></AuthenticatedRoute>} />
      <Route path="/card/:id/edit" element={<DataAdminRoute><EditCardView /></DataAdminRoute>} />
      <Route path="/card/create/new" element={<DataAdminRoute><CreateCardView /></DataAdminRoute>} />
      <Route path="/admin/pack/:id" element={<DataAdminRoute><EditPackView /></DataAdminRoute>} />
      <Route path="/admin/cycles" element={<DataAdminRoute><ManageCyclesView /></DataAdminRoute>} />
      <Route path="/admin/traits" element={<DataAdminRoute><EditTraitsView /></DataAdminRoute>} />
      <Route path="/admin/formats" element={<DataAdminRoute><EditFormatsView /></DataAdminRoute>} />
      <Route path="/admin" element={<DataAdminRoute><AdminView /></DataAdminRoute>} />
      <Route path="/card/:id" element={<CardDetailView />} />
    </RouterRoutes>
  )
}
