import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { PublicLayout } from './components/layout/PublicLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { CompleteProfilePage } from './pages/auth/CompleteProfilePage'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage'
import { CollectionPage } from './pages/dashboard/CollectionPage'
import { ContactSubmissionsPage } from './pages/dashboard/Contactsubmissionspage'
import { PeoplePage } from './pages/dashboard/PeoplePage'
import { ProfilePage } from './pages/dashboard/ProfilePage'
import { EventsPage } from './pages/dashboard/EventsPage'
import { AnnouncementsPage } from './pages/dashboard/AnnouncementsPage'
import { ChoirChatPage } from './pages/dashboard/ChoirChatPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ContentPage } from './pages/public/ContentPage'
import { PublicEventsPage } from './pages/public/EventsPage'
import { ContactPage } from './pages/public/Contactpage'
import { HomePage } from './pages/public/HomePage'
import { AboutPage } from './pages/public/AboutPage'

export default function App() {
  return <Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="events" element={<PublicEventsPage />} />
      <Route path="sermons" element={<ContentPage title="Sermons" description="Watch and listen to messages from our church." collection="sermons" />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="complete-profile" element={<CompleteProfilePage />} />
    </Route>
    <Route element={<ProtectedRoute />}>
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="choir-room" element={<ChoirChatPage />} />
        <Route path="sermons" element={<CollectionPage collection="sermons" editors={['super_admin', 'pastor', 'media']} />} />
        <Route path="prayer-requests" element={<CollectionPage collection="prayerRequests" editors={['super_admin', 'pastor', 'secretary']} />} />
        <Route path="ministries" element={<CollectionPage collection="ministries" editors={['super_admin', 'pastor', 'choir_president', 'youth_leader']} />} />
        <Route path="giving" element={<CollectionPage collection="giving" editors={['super_admin', 'finance']} amount />} />
        <Route path="contact-submissions" element={<ContactSubmissionsPage editors={['super_admin', 'pastor', 'secretary']} />} />
        <Route path="people" element={<PeoplePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
}