import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { useUpdateProfile } from "../../hooks/useProfile";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkerSettingsForm() {
  const { user } = useSelector((state) => state.user);
  const updateProfileMutation = useUpdateProfile();
  const [availabilityTimes, setAvailabilityTimes] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Initialize availability times
  useEffect(() => {
    if (user?.availabilityTimes) {
      setAvailabilityTimes(user.availabilityTimes);
    }
  }, [user]);

  const addAvailabilitySlot = () => {
    setAvailabilityTimes([
      ...availabilityTimes,
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const removeAvailabilitySlot = (index) => {
    setAvailabilityTimes(availabilityTimes.filter((_, i) => i !== index));
  };

  const updateAvailabilitySlot = (index, field, value) => {
    const updated = [...availabilityTimes];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilityTimes(updated);
  };

  const onSubmit = () => {
    // Send availability times exactly as backend expects
    const updateData = {
      availabilityTimes: availabilityTimes,
    };

    updateProfileMutation.mutate(updateData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">🔧</span>
          Work Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Manage your availability and work preferences.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Availability Times */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <Label className="text-lg font-medium">
                  Availability Schedule
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Set your working hours for each day of the week
                </p>
              </div>
              <Button
                type="button"
                onClick={addAvailabilitySlot}
                className="bg-green-600 hover:bg-green-700"
              >
                + Add Time Slot
              </Button>
            </div>

            {availabilityTimes.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  No availability slots added yet.
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Click "Add Time Slot" to set your working hours.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {availabilityTimes.map((slot, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg items-center"
                  >
                    <div className="col-span-3">
                      <Label className="text-sm">Day</Label>
                      <select
                        value={slot.day}
                        onChange={(e) =>
                          updateAvailabilitySlot(index, "day", e.target.value)
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {DAYS.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <Label className="text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateAvailabilitySlot(
                            index,
                            "startTime",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="col-span-3">
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateAvailabilitySlot(
                            index,
                            "endTime",
                            e.target.value,
                          )
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="col-span-3 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => removeAvailabilitySlot(index)}
                        className="bg-red-600 hover:bg-red-700 text-sm px-3 py-1"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Stats Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-3">
              Your Professional Stats
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {user?.completedJobs || 0}
                </p>
                <p className="text-sm text-blue-800">Completed Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {user?.avgRating || 0}
                </p>
                <p className="text-sm text-blue-800">Average Rating</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {user?.totalReviews || 0}
                </p>
                <p className="text-sm text-blue-800">Total Reviews</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  ₹{user?.totalEarnings || 0}
                </p>
                <p className="text-sm text-blue-800">Total Earnings</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-8"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Updating...
                </>
              ) : (
                "Update Work Settings"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
