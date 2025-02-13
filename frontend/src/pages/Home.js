import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("");
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

  useEffect(() => {
    const filtered = workouts?.filter((workout) =>
      workout.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkouts(filtered);
  }, [searchTerm, workouts]);

  useEffect(() => {
    if (sortType === "load") {
      setFilteredWorkouts([...filteredWorkouts].sort((a, b) => b.load - a.load));
    } else if (sortType === "reps") {
      setFilteredWorkouts([...filteredWorkouts].sort((a, b) => b.reps - a.reps));
    }
  }, [sortType, filteredWorkouts]);

  return (
    <div>
        <div className="search-sort">
        <input
          type="text"
          placeholder="Search workouts"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select onChange={(e) => setSortType(e.target.value)} className="sort-dropdown">
          <option value="load">Load</option>
          <option value="reps">Reps</option>
        </select>
      </div>
        <div className="home">


      <div className="workouts">
        {filteredWorkouts && filteredWorkouts.map((workout) => (
          <WorkoutDetails key={workout._id} workout={workout} />
        ))}
      </div>

      <WorkoutForm />
    </div>
    </div>
  );
};

export default Home;
