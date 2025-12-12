import { BookedRoomsViewAPI } from "@/components/BookedRoomsViewAPI";
import { Route, Routes, useNavigate } from "react-router-dom";
import { CreateBooking } from "../components/CreateBooking";
import { Dashboard } from "../components/Dashboard";
import { MyBookings } from "../components/MyBookings";
import { NotificationsComponent } from "../components/Notifications";
import { Overview } from "../components/Overview";
import { Profile } from "../components/Profile";
import { RoomBrowser } from "../components/RoomBrowser";
import { RoomDetails } from "../components/RoomDetails";
import { useAppContext } from "../contexts/AppContext";

export function UserRoutes() {
  const {
    user,
    unreadCount,
    handleLogout,
    bookings,
    rooms,
    notifications,
    handleViewRoom,
    handleCreateBooking,
    handleToggleFavorite,
    handleConfirmBooking,
    preselectedRoomId,
    handleBackToOverview,
    handleEditBooking,
    handleCancelBooking,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleUpdateProfile,
    handleChangePassword,
    selectedRoomId,
  } = useAppContext();
  const navigate = useNavigate();

  if (!user) return null;

  const selectedRoom = selectedRoomId ? rooms.find((r) => r.id === selectedRoomId) : null;

  const handleNavigate = (view: string) => navigate(`/${view}`);

  return (
    <Dashboard
      user={user}
      currentView="" // Không cần nữa vì dùng path
      onNavigate={handleNavigate}
      unreadCount={unreadCount}
      onLogout={() => { handleLogout(); navigate(`/login`) }}
    >
      <Routes>
        <Route
          path="/overview"
          element={
            <Overview
              bookings={bookings}
              rooms={rooms}
              notifications={notifications}
              onViewRoom={(roomId) => {
                handleViewRoom(roomId);
                navigate(`/room-details/${roomId}`);
              }}
              onCreateBooking={() => {
                handleCreateBooking();
                navigate("/create-booking");
              }}
              onBrowseRooms={() => navigate("/browse")}
              onViewBookings={() => navigate("/bookings")}
            />
          }
        />
        <Route
          path="/browse"
          element={
            <RoomBrowser
              rooms={rooms}
              onViewRoom={(roomId) => {
                handleViewRoom(roomId);
                navigate(`/room-details/${roomId}`);
              }}
              onToggleFavorite={handleToggleFavorite}
            />
          }
        />
        <Route
          path="/room-details/:id"
          element={<RoomDetails />}
        />
        <Route
          path="/bookings"
          element={
            <MyBookings
              bookings={bookings.filter((b) => b.status !== "cancelled")}
              onCreateBooking={() => {
                handleCreateBooking();
                navigate("/create-booking");
              }}
              onEditBooking={handleEditBooking}
              onCancelBooking={handleCancelBooking}
            />
          }
        />
        <Route
          path="/create-booking"
          element={
            <CreateBooking
              rooms={rooms}
              bookings={bookings}
              onBack={() => {
                handleBackToOverview();
                navigate("/overview");
              }}
              onConfirm={handleConfirmBooking}
              preselectedRoomId={preselectedRoomId}
            />
          }
        />
        <Route
          path="/notifications"
          element={
            <NotificationsComponent
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/booked-rooms-view"
          element={
            <BookedRoomsViewAPI />
          }
        />
      </Routes>
    </Dashboard>
  );
}
