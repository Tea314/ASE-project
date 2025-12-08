import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  mockBookings,
  mockConflicts,
  mockDepartmentUsage,
  mockMaintenance,
  mockNotifications,
  mockRooms,
  mockUsers,
  mockUtilization,
} from "../data/mockData";
import type { Booking, MaintenanceSchedule, Notification, Room, User } from "../types";
import {
  exportBookingsCSV,
  exportDepartmentUsageCSV,
  exportRoomsCSV,
  exportUtilizationCSV
} from "../utils/exportUtils";
import { safeStorage } from "../utils/safeStorage";

type AppContextType = {
  // States
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  maintenance: MaintenanceSchedule[];
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceSchedule[]>>;
  conflicts: any[]; // Giả sử type từ mockConflicts
  setConflicts: React.Dispatch<React.SetStateAction<any[]>>;
  selectedRoomId: string | null;
  setSelectedRoomId: React.Dispatch<React.SetStateAction<string | null>>;
  preselectedRoomId: string | undefined;
  setPreselectedRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  editBookingDialog: { open: boolean; booking: Booking | null };
  setEditBookingDialog: React.Dispatch<React.SetStateAction<{ open: boolean; booking: Booking | null }>>;
  roomFormDialog: { open: boolean; room: Room | null };
  setRoomFormDialog: React.Dispatch<React.SetStateAction<{ open: boolean; room: Room | null }>>;
  userFormDialog: { open: boolean; user: User | null };
  setUserFormDialog: React.Dispatch<React.SetStateAction<{ open: boolean; user: User | null }>>;
  maintenanceDialog: { open: boolean; maintenance: MaintenanceSchedule | null };
  setMaintenanceDialog: React.Dispatch<React.SetStateAction<{ open: boolean; maintenance: MaintenanceSchedule | null }>>;
  changePasswordDialog: boolean;
  setChangePasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isHighPerf: boolean;
  setIsHighPerf: React.Dispatch<React.SetStateAction<boolean>>;
  unreadCount: number;

  // Handlers (tất cả handlers từ file gốc)
  handleLogin: (email: string, password: string) => void;
  handleLogout: () => void;
  handleViewRoom: (roomId: string) => void;
  handleToggleFavorite: (roomId: string) => void;
  handleCreateBooking: (roomId?: string) => void;
  handleConfirmBooking: (bookingData: {
    roomId: string;
    date: Date;
    startTime: string;
    endTime: string;
    purpose: string;
    teamMembers: string[];
  }) => void;
  handleEditBooking: (bookingId: string) => void;
  handleSaveEditBooking: (bookingId: string, updates: Partial<Booking>) => void;
  handleCancelBooking: (bookingId: string) => void;
  handleMarkAsRead: (notificationId: string) => void;
  handleMarkAllAsRead: () => void;
  handleUpdateProfile: (updates: Partial<User>) => void;
  handleChangePassword: () => void;
  handleSavePassword: (currentPassword: string, newPassword: string) => void;
  handleBackToOverview: () => void;
  handleAddRoom: () => void;
  handleEditRoom: (roomId: string) => void;
  handleSaveRoom: (roomData: Partial<Room> & { id?: string }) => void;
  handleDeleteRoom: (roomId: string) => void;
  handleAddMaintenance: () => void;
  handleSaveMaintenance: (maintenanceData: Partial<MaintenanceSchedule> & { id?: string }) => void;
  handleResolveConflict: (conflictId: string) => void;
  handleAddUser: () => void;
  handleEditUser: (userId: string) => void;
  handleSaveUser: (userData: Partial<User> & { id?: string }) => void;
  handleDeactivateUser: (userId: string) => void;
  handleBulkUpload: () => void;
  handleDownloadReport: (type: "csv" | "pdf") => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Tất cả useState từ file gốc
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
  const [isHighPerf, setIsHighPerf] = useState(() => {
    const saved = safeStorage.getItem(
      "highPerformance",
      "true",
    );
    return saved === "true";
  });
  // useEffect cho performance toggle (từ file gốc)
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = safeStorage.getItem("highPerformance", "true");
      setIsHighPerf(saved === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Tất cả handlers từ file gốc (copy-paste và adjust để dùng setState)
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
    toast.success(
      `Welcome back${isAdmin ? ", Administrator" : ""}!`,
    );
  };

  const handleLogout = () => {
    setUser(null);
    toast.success("Signed out successfully");
  };

  // Room handlers
  const handleViewRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
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

  const handleBackToOverview = () => {
    const defaultView =
      user?.role === "admin" ? "admin-overview" : "overview";
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

  // Export value
  const value = {
    user, setUser, rooms, setRooms, bookings, setBookings, notifications, setNotifications, users, setUsers,
    maintenance, setMaintenance, conflicts, setConflicts, selectedRoomId, setSelectedRoomId,
    preselectedRoomId, setPreselectedRoomId, editBookingDialog, setEditBookingDialog, roomFormDialog, setRoomFormDialog,
    userFormDialog, setUserFormDialog, maintenanceDialog, setMaintenanceDialog, changePasswordDialog, setChangePasswordDialog,
    isHighPerf, setIsHighPerf, unreadCount,
    handleLogin, handleLogout, handleViewRoom, handleToggleFavorite, handleCreateBooking, handleConfirmBooking,
    handleEditBooking, handleSaveEditBooking, handleCancelBooking, handleMarkAsRead, handleMarkAllAsRead,
    handleUpdateProfile, handleChangePassword, handleSavePassword, handleBackToOverview, handleAddRoom,
    handleEditRoom, handleSaveRoom, handleDeleteRoom, handleAddMaintenance, handleSaveMaintenance,
    handleResolveConflict, handleAddUser, handleEditUser, handleSaveUser, handleDeactivateUser,
    handleBulkUpload, handleDownloadReport,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
