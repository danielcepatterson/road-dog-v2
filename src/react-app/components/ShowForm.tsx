import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Show } from "../../worker/types";
import "./ShowForm.css";

interface ShowFormProps {
  onShowCreated?: (show: Show) => void;
  onClose?: () => void;
}

const initialShowData = {
  venueName: "",
  venueAddress: "",
  eventDate: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  loadInTime: "",
  soundCheckTime: "",
  doorsTime: "",
  performanceTime: "",
  parkingDetails: "",
  backlineDrums: "",
  backlineBass: "",
  soundProvided: "",
  notes: "",
};

export const ShowBookingForm = ({ onShowCreated, onClose }: ShowFormProps) => {
  const [formData, setFormData] = useState(initialShowData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const showData = {
        ...formData,
        eventDate: new Date(formData.eventDate),
      };

      const response = await fetch("/api/shows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(showData),
      });

      if (!response.ok) {
        throw new Error("Failed to create show");
      }

      const newShow = await response.json();
      onShowCreated?.(newShow);
      setFormData(initialShowData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formSections = [
    {
      title: "Venue Information",
      fields: [
        { label: "Venue Name", name: "venueName", type: "text" },
        { label: "Venue Address", name: "venueAddress", type: "text" },
        { label: "Event Date", name: "eventDate", type: "datetime-local" },
      ],
    },
    {
      title: "Point of Contact",
      fields: [
        { label: "Contact Name", name: "contactName", type: "text" },
        { label: "Contact Phone", name: "contactPhone", type: "tel" },
        { label: "Contact Email", name: "contactEmail", type: "email" },
      ],
    },
    {
      title: "Show Times",
      fields: [
        { label: "Load In Time", name: "loadInTime", type: "time" },
        { label: "Sound Check Time", name: "soundCheckTime", type: "time" },
        { label: "Doors Time", name: "doorsTime", type: "time" },
        { label: "Performance Time", name: "performanceTime", type: "time" },
      ],
    },
    {
      title: "Logistics & Equipment",
      fields: [
        { label: "Parking Details", name: "parkingDetails", type: "text" },
        { label: "Backline Drums", name: "backlineDrums", type: "text" },
        { label: "Backline Bass", name: "backlineBass", type: "text" },
        { label: "Sound Provided", name: "soundProvided", type: "text" },
      ],
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="show-form">
      <div className="form-header">
        <h2>Book a Show</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="close-button"
            aria-label="Close form"
          >
            ✕
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {formSections.map((section) => (
        <fieldset key={section.title}>
          <legend>{section.title}</legend>
          <div className="form-section">
            {section.fields.map((field) => (
              <div key={field.name} className="form-group">
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={
                    formData[field.name as keyof typeof formData] || ""
                  }
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </fieldset>
      ))}

      <fieldset>
        <legend>Additional Notes</legend>
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            disabled={isLoading}
            rows={4}
          />
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? "Creating Show..." : "Create Show"}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
