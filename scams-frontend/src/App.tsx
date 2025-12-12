/**
 * Room Booking System - Main Application
 * Comprehensive booking system with revolutionary features
 */
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ParticleNetwork } from "./components/ParticleNetwork";
import { PerformanceToggle } from "./components/PerformanceToggle";
import { SmartTheme } from "./components/SmartTheme";
import { NetworkStatus } from "./components/NetworkStatus";
import { AIAssistant } from "./components/AIAssistant";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { RealtimeActivity } from "./components/RealtimeActivity";
import { CommandPalette, useCommandPalette } from "./components/CommandPalette";
import { EditBookingDialog } from "./components/dialogs/EditBookingDialog";
import { RoomFormDialog } from "./components/dialogs/RoomFormDialog";
import { UserFormDialog } from "./components/dialogs/UserFormDialog";
import { MaintenanceDialog } from "./components/dialogs/MaintenanceDialog";
import { ChangePasswordDialog } from "./components/dialogs/ChangePasswordDialog";
import { AppProvider, useAppContext } from "./contexts/AppContext";
import { AuthRoutes } from "./routes/AuthRoutes";
import { UserRoutes } from "./routes/UserRoutes";
import { AdminRoutes } from "./routes/AdminRoutes";
import { LoadingScreen } from "./components/LoadingStates";
import { Bell, Calendar, Home, LogOut, Plus, Search, User as UserIcon } from "lucide-react";

function AppContent() {
  const { user, isLoading, isHighPerf, unreadCount, handleCreateBooking, handleLogout, editBookingDialog, setEditBookingDialog, rooms, handleSaveEditBooking, roomFormDialog, setRoomFormDialog, handleSaveRoom, userFormDialog, setUserFormDialog, handleSaveUser, maintenanceDialog, setMaintenanceDialog, handleSaveMaintenance, changePasswordDialog, setChangePasswordDialog, handleSavePassword } = useAppContext();
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } = useCommandPalette();
  const navigate = useNavigate(); // Để dùng trong commands nếu cần

  // console.log("User: ", user)
  const quickActions = user
    ? [
      { icon: Plus, label: "New Booking", action: () => handleCreateBooking(), color: "bg-blue-600" },
      { icon: Search, label: "Browse Rooms", action: () => navigate("/browse"), color: "bg-purple-600" },
      { icon: Calendar, label: "My Bookings", action: () => navigate("/bookings"), color: "bg-pink-600" },
    ]
    : [];

  // Commands for CommandPalette (từ file gốc, adjust path)
  const commands = user
    ? [
      { id: "nav-overview", label: "Go to Overview", description: "View your dashboard", icon: Home, action: () => navigate(user.role === "admin" ? "/admin/overview" : "/overview"), category: "navigation" as const },
      { id: "nav-browse", label: "Browse Rooms", description: "Find available meeting rooms", icon: Search, action: () => navigate("/browse"), category: "navigation" as const },
      { id: "nav-bookings", label: "My Bookings", description: "View your reservations", icon: Calendar, action: () => navigate("/bookings"), category: "navigation" as const },
      { id: "nav-notifications", label: "Notifications", description: `${unreadCount} unread`, icon: Bell, action: () => navigate(user.role === "admin" ? "/admin/notifications" : "/notifications"), category: "navigation" as const },
      { id: "nav-profile", label: "Profile Settings", description: "Manage your account", icon: UserIcon, action: () => navigate("/profile"), category: "navigation" as const },
      { id: "action-book", label: "Book a Room", description: "Create new booking", icon: Plus, action: handleCreateBooking, shortcut: "⌘B", category: "actions" as const },
      { id: "action-logout", label: "Sign Out", description: "Log out of your account", icon: LogOut, action: handleLogout, category: "actions" as const },
    ]
    : [];

  if (isLoading && user) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <NetworkStatus />
      {isHighPerf && <ParticleNetwork />}
      <SmartTheme />
      <PerformanceToggle />
      {user && <FloatingActionButton actions={quickActions} />}
      {user && <AIAssistant onBookRoom={handleCreateBooking} />}
      <RealtimeActivity />
      <CommandPalette
        commands={commands}
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <Routes>
        {!user ? (
          <Route path="/*" element={<AuthRoutes />} />
        ) : user.role === "admin" ? (
          <Route path="/*" element={<AdminRoutes />} />
        ) : (
          <Route path="/*" element={<UserRoutes />} />
        )}
        {/* Redirect nếu sai path */}
        <Route path="*" element={<Navigate to={user ? (user.role === "admin" ? "/admin/overview" : "/overview") : "/"} />} />
      </Routes>
      <Toaster />

      {/* Global Dialogs */}
      <EditBookingDialog
        booking={editBookingDialog.booking}
        rooms={rooms}
        open={editBookingDialog.open}
        onClose={() => setEditBookingDialog({ open: false, booking: null })}
        onSave={handleSaveEditBooking}
      />
      <RoomFormDialog
        room={roomFormDialog.room}
        open={roomFormDialog.open}
        onClose={() => setRoomFormDialog({ open: false, room: null })}
        onSave={handleSaveRoom}
      />
      <UserFormDialog
        user={userFormDialog.user}
        open={userFormDialog.open}
        onClose={() => setUserFormDialog({ open: false, user: null })}
        onSave={handleSaveUser}
      />
      <MaintenanceDialog
        rooms={rooms}
        maintenance={maintenanceDialog.maintenance}
        open={maintenanceDialog.open}
        onClose={() => setMaintenanceDialog({ open: false, maintenance: null })}
        onSave={handleSaveMaintenance}
      />
      <ChangePasswordDialog
        open={changePasswordDialog}
        onClose={() => setChangePasswordDialog(false)}
        onSave={handleSavePassword}
      />
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
