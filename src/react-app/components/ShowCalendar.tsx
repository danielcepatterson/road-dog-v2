import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Show } from "../../worker/types";
import "./ShowCalendar.css";

interface ShowCalendarProps {
  onBookingClick?: () => void;
}

interface ShowDetails extends Show {
  formattedDate?: string;
}

export const ShowCalendar = ({ onBookingClick }: ShowCalendarProps) => {
  const [shows, setShows] = useState<ShowDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<ShowDetails | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchShows();
  }, [token]);

  const fetchShows = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/shows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shows");
      }

      const data = await response.json();
      const formattedShows = data.map((show: Show) => ({
        ...show,
        eventDate: new Date(show.eventDate),
        formattedDate: new Date(show.eventDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));

      // Sort by date
      formattedShows.sort(
        (a: ShowDetails, b: ShowDetails) =>
          a.eventDate.getTime() - b.eventDate.getTime()
      );

      setShows(formattedShows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load shows");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (showId: string) => {
    if (!window.confirm("Are you sure you want to delete this show?")) {
      return;
    }

    try {
      const response = await fetch(`/api/shows/${showId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete show");
      }

      setShows((prev) => prev.filter((s) => s.id !== showId));
      setSelectedShow(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete show");
    }
  };

  return (
    <div className="show-calendar">
      <div className="calendar-header">
        <h1>Upcoming Shows</h1>
        <button onClick={onBookingClick} className="book-show-button">
          + Book a Show
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading shows...</div>
      ) : shows.length === 0 ? (
        <div className="empty-state">
          <p>No shows booked yet.</p>
          <button onClick={onBookingClick} className="book-show-button">
            Book your first show
          </button>
        </div>
      ) : (
        <div className="shows-grid">
          {shows.map((show) => (
            <div
              key={show.id}
              className={`show-card ${
                selectedShow?.id === show.id ? "selected" : ""
              }`}
              onClick={() => setSelectedShow(show)}
            >
              <div className="show-card-header">
                <h3>{show.venueName}</h3>
                <span className="show-date">{show.formattedDate}</span>
              </div>
              <div className="show-card-body">
                <p className="show-time">
                  Performance: <strong>{show.performanceTime}</strong>
                </p>
                <p className="show-location">{show.venueAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedShow && (
        <div className="show-details-modal" onClick={() => setSelectedShow(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setSelectedShow(null)}
            >
              ✕
            </button>

            <h2>{selectedShow.venueName}</h2>

            <div className="details-section">
              <h3>Venue Information</h3>
              <p>
                <strong>Address:</strong> {selectedShow.venueAddress}
              </p>
              <p>
                <strong>Date:</strong> {selectedShow.formattedDate}
              </p>
            </div>

            <div className="details-section">
              <h3>Point of Contact</h3>
              <p>
                <strong>Name:</strong> {selectedShow.contactName}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                <a href={`tel:${selectedShow.contactPhone}`}>
                  {selectedShow.contactPhone}
                </a>
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${selectedShow.contactEmail}`}>
                  {selectedShow.contactEmail}
                </a>
              </p>
            </div>

            <div className="details-section">
              <h3>Show Times</h3>
              <p>
                <strong>Load In:</strong> {selectedShow.loadInTime}
              </p>
              <p>
                <strong>Sound Check:</strong> {selectedShow.soundCheckTime}
              </p>
              <p>
                <strong>Doors:</strong> {selectedShow.doorsTime}
              </p>
              <p>
                <strong>Performance:</strong> {selectedShow.performanceTime}
              </p>
            </div>

            <div className="details-section">
              <h3>Logistics & Equipment</h3>
              <p>
                <strong>Parking:</strong> {selectedShow.parkingDetails}
              </p>
              <p>
                <strong>Backline Drums:</strong> {selectedShow.backlineDrums}
              </p>
              <p>
                <strong>Backline Bass:</strong> {selectedShow.backlineBass}
              </p>
              <p>
                <strong>Sound Provided:</strong> {selectedShow.soundProvided}
              </p>
            </div>

            {selectedShow.notes && (
              <div className="details-section">
                <h3>Notes</h3>
                <p>{selectedShow.notes}</p>
              </div>
            )}

            <div className="modal-actions">
              <button
                className="delete-button"
                onClick={() => handleDelete(selectedShow.id)}
              >
                Delete Show
              </button>
              <button
                className="close-modal-button"
                onClick={() => setSelectedShow(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
