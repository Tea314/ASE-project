/**
 * Room Booking System - Main Application
 * Comprehensive booking system with revolutionary features
 */
import {
  Bell,
  Calendar,
  Home,
  LogOut,
  Plus,
  Search,
  User as UserIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AIAssistant } from "./components/AIAssistant";
import {
  CommandPalette,
  useCommandPalette,
} from "./components/CommandPalette";
import { CreateBooking } from "./components/CreateBooking";
import { Dashboard } from "./components/Dashboard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FloatingActionButton } from "./components/FloatingActionButton";
import { ForgotPassword } from "./components/ForgotPassword";
import { HeroPage } from "./components/HeroPage";
import { LoginPage } from "./components/LoginPage";
import { MyBookings } from "./components/MyBookings";
import { NetworkStatus } from "./components/NetworkStatus";
import { NotificationsComponent } from "./components/Notifications";
import { Overview } from "./components/Overview";
import { ParticleNetwork } from "./components/ParticleNetwork";
import { PerformanceToggle } from "./components/PerformanceToggle";
import { Profile } from "./components/Profile";
import { RealtimeActivity } from "./components/RealtimeActivity";
import { RoomBrowser } from "./components/RoomBrowser";
import { RoomDetails } from "./components/RoomDetails";
import { SignUpPage, type SignUpData } from "./components/SignUpPage";
import { SmartTheme } from "./components/SmartTheme";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminOverview } from "./components/admin/AdminOverview";
import { AdminSettings } from "./components/admin/AdminSettings";
import { Analytics } from "./components/admin/Analytics";
import { BookingManagement } from "./components/admin/BookingManagement";
import { RoomManagement } from "./components/admin/RoomManagement";
import { UserManagement } from "./components/admin/UserManagement";
import { ChangePasswordDialog } from "./components/dialogs/ChangePasswordDialog";
import { EditBookingDialog } from "./components/dialogs/EditBookingDialog";
import { MaintenanceDialog } from "./components/dialogs/MaintenanceDialog";
import { RoomFormDialog } from "./components/dialogs/RoomFormDialog";
import { UserFormDialog } from "./components/dialogs/UserFormDialog";
import { Toaster } from "./components/ui/sonner";
import {
  mockBookings,
  mockConflicts,
  mockDepartmentUsage,
  mockMaintenance,
  mockNotifications,
  mockRooms,
  mockUsers,
  mockUtilization,
} from "./data/mockData";
import type { Booking, MaintenanceSchedule, Notification, Room, User } from "./types";
import {
  exportBookingsCSV,
  exportDepartmentUsageCSV,
  exportRoomsCSV,
  exportUtilizationCSV
} from "./utils/exportUtils";
import { safeStorage } from "./utils/safeStorage";

type View =
  | "hero"
  | "login"
  | "forgot-password"
  | "overview"
  | "browse"
  | "room-details"
  | "bookings"
  | "create-booking"
  | "notifications"
  | "profile"
  | "admin-overview"
  | "admin-rooms"
  | "admin-bookings"
  | "admin-users"
  | "admin-analytics"
  | "admin-notifications"
  | "admin-settings"
  | "signup";

export default function App() {
  // Auth state - Room Booking System
  const [currentView, setCurrentView] = useState<View>("hero");
  const [user, setUser] = useState<User | null>(null);

  // Data state
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [bookings, setBookings] =
    useState<Booking[]>(mockBookings);
  const [notifications, setNotifications] = useState<
    Notification[]
  >(mockNotifications);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [maintenance, setMaintenance] =
    useState(mockMaintenance);
  const [conflicts, setConflicts] = useState(mockConflicts);

  // UI state
  const [selectedRoomId, setSelectedRoomId] = useState<
    string | null
  >(null);
  const [preselectedRoomId, setPreselectedRoomId] = useState<
    string | undefined
  >(undefined);

  // Dialog states
  const [editBookingDialog, setEditBookingDialog] = useState<{
    open: boolean;
    booking: Booking | null;
  }>({
    open: false,
    booking: null,
  });
  const [roomFormDialog, setRoomFormDialog] = useState<{
    open: boolean;
    room: Room | null;
  }>({
    open: false,
    room: null,
  });
  const [userFormDialog, setUserFormDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });
  const [maintenanceDialog, setMaintenanceDialog] = useState<{
    open: boolean;
    maintenance: MaintenanceSchedule | null;
  }>({
    open: false,
    maintenance: null,
  });
  const [changePasswordDialog, setChangePasswordDialog] =
    useState(false);

  // Auth handlers
  const handleLogin = (email: string, password: string) => {
    // Mock authentication - determine role based on email
    const isAdmin = email.toLowerCase().includes("admin");
    const mockUser: User = {
      id: isAdmin ? "admin-1" : "user-1",
      name: isAdmin ? "Admin User" : "John Doe",
      email: email,
      department: isAdmin ? "IT" : "Engineering",
      role: isAdmin ? "admin" : "employee",
      status: "active",
    };
    setUser(mockUser);
    setCurrentView(isAdmin ? "admin-overview" : "overview");
    toast.success(
      `Welcome back${isAdmin ? ", Administrator" : ""}!`,
    );
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView("login");
    toast.success("Signed out successfully");
  };

  // Room handlers
  const handleViewRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
    setCurrentView("room-details");
  };

  const handleToggleFavorite = (roomId: string) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, isFavorite: !room.isFavorite }
          : room,
      ),
    );
    const room = rooms.find((r) => r.id === roomId);
    if (room?.isFavorite) {
      toast.success("Removed from favorites");
    } else {
      toast.success("Added to favorites");
    }
  };

  // Booking handlers
  const handleCreateBooking = (roomId?: string) => {
    setPreselectedRoomId(roomId);
    setCurrentView("create-booking");
  };

  const handleConfirmBooking = (bookingData: {
    roomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
    teamMembers: string[];
  }) => {
    const room = rooms.find((r) => r.id === bookingData.roomId);
    if (!room) return;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      roomId: bookingData.roomId,
      roomName: room.name,
      userId: user?.id || "",
      date: bookingData.date.toISOString().split("T")[0],
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      purpose: bookingData.purpose,
      teamMembers: bookingData.teamMembers,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [...prev, newBooking]);

    // Add confirmation notification
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      type: "confirmation",
      title: "Booking Confirmed",
      message: `Your booking for ${room.name} has been confirmed.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    toast.success("Booking created successfully!");
  };

  const handleEditBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setEditBookingDialog({ open: true, booking });
    }
  };

  const handleSaveEditBooking = (
    bookingId: string,
    updates: Partial<Booking>,
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, ...updates } : b,
      ),
    );

    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      type: "change",
      title: "Booking Updated",
      message: `Your booking has been updated successfully.`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    toast.success("Booking updated successfully");
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId
          ? { ...booking, status: "cancelled" as const }
          : booking,
      ),
    );

    // Add cancellation notification
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      const newNotification: Notification = {
        id: `notification-${Date.now()}`,
        type: "cancellation",
        title: "Booking Cancelled",
        message: `Your booking for ${booking.roomName} has been cancelled.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }

    toast.success("Booking cancelled");
  };

  // Notification handlers
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true })),
    );
    toast.success("All notifications marked as read");
  };

  // Profile handlers
  const handleUpdateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
      toast.success("Profile updated successfully");
    }
  };

  const handleChangePassword = () => {
    setChangePasswordDialog(true);
  };

  const handleSavePassword = (
    currentPassword: string,
    newPassword: string,
  ) => {
    // In a real app, this would call an API
    toast.success("Password changed successfully");
  };

  // Navigation handler
  const handleNavigate = (view: string) => {
    setCurrentView(view as View);
  };

  const handleBackToOverview = () => {
    const defaultView =
      user?.role === "admin" ? "admin-overview" : "overview";
    setCurrentView(defaultView);
    setSelectedRoomId(null);
    setPreselectedRoomId(undefined);
  };

  // Admin handlers
  const handleAddRoom = () => {
    setRoomFormDialog({ open: true, room: null });
  };

  const handleEditRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setRoomFormDialog({ open: true, room });
    }
  };

  const handleSaveRoom = (
    roomData: Partial<Room> & { id?: string },
  ) => {
    if (roomData.id) {
      // Update existing room
      setRooms((prev) =>
        prev.map((r) =>
          r.id === roomData.id ? { ...r, ...roomData } : r,
        ),
      );
      toast.success("Room updated successfully");
    } else {
      // Add new room
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: roomData.name!,
        location: roomData.location!,
        floor: roomData.floor,
        capacity: roomData.capacity!,
        type: roomData.type,
        description: roomData.description!,
        equipment: roomData.equipment!,
        status: roomData.status || "available",
        image: roomData.image!,
      };
      setRooms((prev) => [...prev, newRoom]);
      toast.success("Room created successfully");
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    toast.success("Room deleted");
  };

  const handleAddMaintenance = () => {
    setMaintenanceDialog({ open: true, maintenance: null });
  };

  const handleSaveMaintenance = (
    maintenanceData: Partial<MaintenanceSchedule> & {
      id?: string;
    },
  ) => {
    if (maintenanceData.id) {
      // Update existing
      setMaintenance((prev) =>
        prev.map((m) =>
          m.id === maintenanceData.id
            ? { ...m, ...maintenanceData }
            : m,
        ),
      );
      toast.success("Maintenance schedule updated");
    } else {
      // Add new
      const newMaintenance: MaintenanceSchedule = {
        id: `m-${Date.now()}`,
        roomId: maintenanceData.roomId!,
        roomName: maintenanceData.roomName!,
        startDate: maintenanceData.startDate!,
        endDate: maintenanceData.endDate!,
        reason: maintenanceData.reason!,
        status: maintenanceData.status || "scheduled",
      };
      setMaintenance((prev) => [...prev, newMaintenance]);

      // Update room status
      setRooms((prev) =>
        prev.map((r) =>
          r.id === maintenanceData.roomId
            ? { ...r, status: "maintenance" as const }
            : r,
        ),
      );

      toast.success("Maintenance scheduled");
    }
  };

  const handleResolveConflict = (conflictId: string) => {
    setConflicts((prev) =>
      prev.filter((c) => c.id !== conflictId),
    );
    toast.success("Conflict resolved");
  };

  const handleAddUser = () => {
    setUserFormDialog({ open: true, user: null });
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setUserFormDialog({ open: true, user });
    }
  };

  const handleSaveUser = (
    userData: Partial<User> & { id?: string },
  ) => {
    if (userData.id) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userData.id ? { ...u, ...userData } : u,
        ),
      );
      toast.success("User updated successfully");
    } else {
      // Add new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name!,
        email: userData.email!,
        department: userData.department!,
        role: userData.role || "employee",
        status: userData.status || "active",
        createdAt:
          userData.createdAt || new Date().toISOString(),
      };
      setUsers((prev) => [...prev, newUser]);
      toast.success("User created successfully");
    }
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: "inactive" as const }
          : u,
      ),
    );
    toast.success("User deactivated");
  };

  const handleBulkUpload = () => {
    toast.info(
      "Bulk upload: Please prepare a CSV file with columns: name, email, department, role",
    );
  };

  const handleDownloadReport = (type: "csv" | "pdf") => {
    if (type === "csv") {
      // Export all analytics data
      exportUtilizationCSV(mockUtilization);
      exportDepartmentUsageCSV(mockDepartmentUsage);
      exportBookingsCSV(bookings);
      exportRoomsCSV(rooms);
      toast.success("CSV reports downloaded");
    } else {
      toast.info("PDF export feature coming soon");
    }
  };

  // Command palette integration
  const {
    open: commandPaletteOpen,
    setOpen: setCommandPaletteOpen,
  } = useCommandPalette();

  // Performance mode - safe storage with error handling
  const [isHighPerf, setIsHighPerf] = useState(() => {
    const saved = safeStorage.getItem(
      "highPerformance",
      "true",
    );
    return saved === "true";
  });

  // Listen for performance toggle changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = safeStorage.getItem(
        "highPerformance",
        "true",
      );
      setIsHighPerf(saved === "true");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorageChange);
      return () =>
        window.removeEventListener(
          "storage",
          handleStorageChange,
        );
    }
  }, []);

  // Calculate unread notifications count
  const unreadCount = notifications.filter(
    (n) => !n.read,
  ).length;

  // Generate commands based on current user
  const commands = user
    ? [
      // Navigation
      {
        id: "nav-overview",
        label: "Go to Overview",
        description: "View your dashboard",
        icon: Home,
        action: () =>
          handleNavigate(
            user.role === "admin"
              ? "admin-overview"
              : "overview",
          ),
        category: "navigation" as const,
      },
      {
        id: "nav-browse",
        label: "Browse Rooms",
        description: "Find available meeting rooms",
        icon: Search,
        action: () => handleNavigate("browse"),
        category: "navigation" as const,
      },
      {
        id: "nav-bookings",
        label: "My Bookings",
        description: "View your reservations",
        icon: Calendar,
        action: () => handleNavigate("bookings"),
        category: "navigation" as const,
      },
      {
        id: "nav-notifications",
        label: "Notifications",
        description: `${unreadCount} unread`,
        icon: Bell,
        action: () =>
          handleNavigate(
            user.role === "admin"
              ? "admin-notifications"
              : "notifications",
          ),
        category: "navigation" as const,
      },
      {
        id: "nav-profile",
        label: "Profile Settings",
        description: "Manage your account",
        icon: UserIcon,
        action: () => handleNavigate("profile"),
        category: "navigation" as const,
      },
      // Quick actions
      {
        id: "action-book",
        label: "Book a Room",
        description: "Create new booking",
        icon: Plus,
        action: () => handleCreateBooking(),
        shortcut: "⌘B",
        category: "actions" as const,
      },
      {
        id: "action-logout",
        label: "Sign Out",
        description: "Log out of your account",
        icon: LogOut,
        action: handleLogout,
        category: "actions" as const,
      },
    ]
    : [];

  // Quick actions for FAB
  const quickActions = user
    ? [
      {
        icon: Plus,
        label: "New Booking",
        action: () => handleCreateBooking(),
        color: "bg-blue-600",
      },
      {
        icon: Search,
        label: "Browse Rooms",
        action: () => handleNavigate("browse"),
        color: "bg-purple-600",
      },
      {
        icon: Calendar,
        label: "My Bookings",
        action: () => handleNavigate("bookings"),
        color: "bg-pink-600",
      },
    ]
    : [];

  // Render current view
  if (currentView === "hero") {
    return (
      <ErrorBoundary>
        <NetworkStatus />
        {isHighPerf && <ParticleNetwork />}
        <HeroPage
          onGetStarted={() => setCurrentView("login")}
        />
        <PerformanceToggle />
        <SmartTheme />
        <Toaster />
      </ErrorBoundary>
    );
  }

  if (currentView === "login") {
    return (
      <ErrorBoundary>
        {isHighPerf && <ParticleNetwork />}
        <LoginPage
          onLogin={handleLogin}
          onForgotPassword={() =>
            setCurrentView("forgot-password")
          }
          onSignUp={() => setCurrentView("signup")}
        />
        <PerformanceToggle />
        <Toaster />
      </ErrorBoundary>
    );
  }

  if (currentView === "forgot-password") {
    return (
      <ErrorBoundary>
        <ForgotPassword
          onBack={() => setCurrentView("login")}
        />
        <PerformanceToggle />
        <Toaster />
      </ErrorBoundary>
    );
  }

  if (currentView === "signup") {
    return (
      <ErrorBoundary>
        {isHighPerf && <ParticleNetwork />}
        <SignUpPage
          onSignUp={(data: SignUpData) => {
            // Mock sign up - Here you would send data to backend
            const newUser: User = {
              id: `user-${Date.now()}`,
              name: data.fullName,
              email: data.email,
              department: data.department,
              role: "employee",
              status: "active",
              createdAt: new Date().toISOString(),
            };
            setUsers((prev) => [...prev, newUser]);
            setUser(newUser);
            setCurrentView("overview");
          }}
          onBackToLogin={() => setCurrentView("login")}
        />
        <PerformanceToggle />
        <Toaster />
      </ErrorBoundary>
    );
  }

  if (!user) return null;

  const selectedRoom = selectedRoomId
    ? rooms.find((r) => r.id === selectedRoomId)
    : null;

  // Admin Dashboard
  if (user.role === "admin") {
    return (
      <ErrorBoundary>
        {isHighPerf && <ParticleNetwork />}
        <SmartTheme />
        <PerformanceToggle />
        <FloatingActionButton actions={quickActions} />
        <AIAssistant onBookRoom={() => handleCreateBooking()} />
        <RealtimeActivity />
        <CommandPalette
          commands={commands}
          open={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
        <AdminDashboard
          user={user}
          currentView={currentView}
          onNavigate={handleNavigate}
          unreadCount={unreadCount}
          onLogout={handleLogout}
        >
          {currentView === "admin-overview" && (
            <AdminOverview
              rooms={rooms}
              bookings={bookings}
              conflicts={conflicts}
              maintenance={maintenance}
              onCreateBooking={() => handleCreateBooking()}
              onBrowseRooms={() => handleNavigate("browse")}
              onViewBookings={() => handleNavigate("bookings")}
              onViewAnalytics={() =>
                handleNavigate("admin-analytics")
              }
            />
          )}

          {currentView === "admin-rooms" && (
            <RoomManagement
              rooms={rooms}
              maintenance={maintenance}
              onAddRoom={handleAddRoom}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
              onAddMaintenance={handleAddMaintenance}
            />
          )}

          {currentView === "admin-bookings" && (
            <BookingManagement
              bookings={bookings}
              conflicts={conflicts}
              onCreateBooking={() => handleCreateBooking()}
              onEditBooking={handleEditBooking}
              onCancelBooking={handleCancelBooking}
              onResolveConflict={handleResolveConflict}
            />
          )}

          {currentView === "admin-users" && (
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeactivateUser={handleDeactivateUser}
              onBulkUpload={handleBulkUpload}
            />
          )}

          {currentView === "admin-analytics" && (
            <Analytics
              utilization={mockUtilization}
              departmentUsage={mockDepartmentUsage}
              onDownloadReport={handleDownloadReport}
            />
          )}

          {currentView === "admin-notifications" && (
            <NotificationsComponent
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          )}

          {currentView === "admin-settings" && (
            <AdminSettings
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          )}
        </AdminDashboard>
        <Toaster />

        {/* Admin Dialogs */}
        <RoomFormDialog
          room={roomFormDialog.room}
          open={roomFormDialog.open}
          onClose={() =>
            setRoomFormDialog({ open: false, room: null })
          }
          onSave={handleSaveRoom}
        />
        <UserFormDialog
          user={userFormDialog.user}
          open={userFormDialog.open}
          onClose={() =>
            setUserFormDialog({ open: false, user: null })
          }
          onSave={handleSaveUser}
        />
        <MaintenanceDialog
          rooms={rooms}
          maintenance={maintenanceDialog.maintenance}
          open={maintenanceDialog.open}
          onClose={() =>
            setMaintenanceDialog({
              open: false,
              maintenance: null,
            })
          }
          onSave={handleSaveMaintenance}
        />
        <EditBookingDialog
          booking={editBookingDialog.booking}
          rooms={rooms}
          open={editBookingDialog.open}
          onClose={() =>
            setEditBookingDialog({ open: false, booking: null })
          }
          onSave={handleSaveEditBooking}
        />
        <ChangePasswordDialog
          open={changePasswordDialog}
          onClose={() => setChangePasswordDialog(false)}
          onSave={handleSavePassword}
        />
      </ErrorBoundary>
    );
  }

  // Employee Dashboard
  return (
    <ErrorBoundary>
      {isHighPerf && <ParticleNetwork />}
      <SmartTheme />
      <PerformanceToggle />
      <FloatingActionButton actions={quickActions} />
      <AIAssistant onBookRoom={() => handleCreateBooking()} />
      <RealtimeActivity />
      <CommandPalette
        commands={commands}
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <Dashboard
        user={user}
        currentView={currentView}
        onNavigate={handleNavigate}
        unreadCount={unreadCount}
        onLogout={handleLogout}
      >
        {currentView === "overview" && (
          <Overview
            bookings={bookings}
            rooms={rooms}
            notifications={notifications}
            onViewRoom={handleViewRoom}
            onCreateBooking={() => handleCreateBooking()}
            onBrowseRooms={() => handleNavigate("browse")}
            onViewBookings={() => handleNavigate("bookings")}
          />
        )}

        {currentView === "browse" && (
          <RoomBrowser
            rooms={rooms}
            onViewRoom={handleViewRoom}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === "room-details" && selectedRoom && (
          <RoomDetails
            room={selectedRoom}
            onBack={() => setCurrentView("browse")}
            onBook={handleCreateBooking}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentView === "bookings" && (
          <MyBookings
            bookings={bookings.filter(
              (b) => b.status !== "cancelled",
            )}
            onCreateBooking={() => handleCreateBooking()}
            onEditBooking={handleEditBooking}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {currentView === "create-booking" && (
          <CreateBooking
            rooms={rooms}
            bookings={bookings}
            onBack={handleBackToOverview}
            onConfirm={handleConfirmBooking}
            preselectedRoomId={preselectedRoomId}
          />
        )}

        {currentView === "notifications" && (
          <NotificationsComponent
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        )}

        {currentView === "profile" && (
          <Profile
            user={user}
            onUpdateProfile={handleUpdateProfile}
            onChangePassword={handleChangePassword}
            onLogout={handleLogout}
          />
        )}
      </Dashboard>
      <Toaster />

      {/* Dialogs */}
      <EditBookingDialog
        booking={editBookingDialog.booking}
        rooms={rooms}
        open={editBookingDialog.open}
        onClose={() =>
          setEditBookingDialog({ open: false, booking: null })
        }
        onSave={handleSaveEditBooking}
      />
      <ChangePasswordDialog
        open={changePasswordDialog}
        onClose={() => setChangePasswordDialog(false)}
        onSave={handleSavePassword}
      />
    </ErrorBoundary>
  );
}
