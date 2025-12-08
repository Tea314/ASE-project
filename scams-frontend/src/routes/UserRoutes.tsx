import { Route, Routes, useNavigate } from "react-router-dom";
import { Dashboard } from "../components/Dashboard";
import { Overview } from "../components/Overview";
import { RoomBrowser } from "../components/RoomBrowser";
import { RoomDetails } from "../components/RoomDetails";
import { MyBookings } from "../components/MyBookings";
import { CreateBooking } from "../components/CreateBooking";
import { NotificationsComponent } from "../components/Notifications";
import { Profile } from "../components/Profile";
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

  const handleNavigate = (view: string) => navigate(view);

  return (
    <Dashboard
      user={user}
      currentView="" // Không cần nữa vì dùng path
      onNavigate={handleNavigate}
      unreadCount={unreadCount}
      onLogout={handleLogout}
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
              onCreateBooking={handleCreateBooking}
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
          path="/room-details/:roomId"
          element={
            selectedRoom ? (
              <RoomDetails
                room={selectedRoom}
                onBack={() => navigate("/browse")}
                onBook={(roomId) => {
                  handleCreateBooking(roomId);
                  navigate("/create-booking");
                }}
                onToggleFavorite={handleToggleFavorite}
              />
            ) : null
          }
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
      </Routes>
    </Dashboard>
  );
}
