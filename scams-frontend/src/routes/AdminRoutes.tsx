import { Route, Routes, useNavigate } from "react-router-dom";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { AdminOverview } from "../components/admin/AdminOverview";
import { RoomManagement } from "../components/admin/RoomManagement";
import { BookingManagement } from "../components/admin/BookingManagement";
import { UserManagement } from "../components/admin/UserManagement";
import { Analytics } from "../components/admin/Analytics";
import { NotificationsComponent } from "../components/Notifications";
import { AdminSettings } from "../components/admin/AdminSettings";
import { useAppContext } from "../contexts/AppContext";
import { mockDepartmentUsage, mockUtilization } from "@/data/mockData";
export function AdminRoutes() {
  const {
    user,
    unreadCount,
    handleLogout,
    rooms,
    bookings,
    conflicts,
    maintenance,
    users,
    handleCreateBooking,
    handleAddRoom,
    handleEditRoom,
    handleDeleteRoom,
    handleAddMaintenance,
    handleEditBooking,
    handleCancelBooking,
    handleResolveConflict,
    handleAddUser,
    handleEditUser,
    handleDeactivateUser,
    handleBulkUpload,
    handleDownloadReport,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleUpdateProfile,
    handleChangePassword,
    notifications,
  } = useAppContext();
  const navigate = useNavigate();

  if (!user || user.role !== "admin") return null;

  const handleNavigate = (view: string) => navigate(`/admin/${view}`);

  return (
    <AdminDashboard
      user={user}
      currentView="" // Không cần nữa
      onNavigate={handleNavigate}
      unreadCount={unreadCount}
      onLogout={handleLogout}
    >
      <Routes>
        <Route
          path="/admin/overview"
          element={
            <AdminOverview
              rooms={rooms}
              bookings={bookings}
              conflicts={conflicts}
              maintenance={maintenance}
              onCreateBooking={() => {
                handleCreateBooking();
                navigate("/create-booking");
              }}
              onBrowseRooms={() => navigate("/browse")} // Có thể adjust nếu admin cần browse
              onViewBookings={() => navigate("/admin/bookings")}
              onViewAnalytics={() => navigate("/admin/analytics")}
            />
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <RoomManagement
              rooms={rooms}
              maintenance={maintenance}
              onAddRoom={handleAddRoom}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
              onAddMaintenance={handleAddMaintenance}
            />
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <BookingManagement
              bookings={bookings}
              conflicts={conflicts}
              onCreateBooking={() => {
                handleCreateBooking();
                navigate("/create-booking");
              }}
              onEditBooking={handleEditBooking}
              onCancelBooking={handleCancelBooking}
              onResolveConflict={handleResolveConflict}
            />
          }
        />
        <Route
          path="/admin/users"
          element={
            <UserManagement
              users={users}
              onAddUser={handleAddUser}
              onEditUser={handleEditUser}
              onDeactivateUser={handleDeactivateUser}
              onBulkUpload={handleBulkUpload}
            />
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <Analytics
              utilization={mockUtilization}
              departmentUsage={mockDepartmentUsage}
              onDownloadReport={handleDownloadReport}
            />
          }
        />
        <Route
          path="/admin/notifications"
          element={
            <NotificationsComponent
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminSettings
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          }
        />
      </Routes>
    </AdminDashboard>
  );
}
