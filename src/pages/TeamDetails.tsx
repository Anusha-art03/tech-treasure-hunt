import { useState } from "react";
import { Anchor, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

type TeamDetailsProps = {
  onStart: (team: {
    id: number;
    teamNumber: number;
    teamName: string;
    members: string[];
  }) => void;
};

function TeamDetails({ onStart }: TeamDetailsProps) {
  const [teamNumber, setTeamNumber] = useState("");
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState(["", "", "", "", ""]);
  const [isSaving, setIsSaving] = useState(false);

  const updateMember = (index: number, value: string) => {
    setMembers((previous) => {
      const updated = [...previous];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!teamNumber || !teamName.trim()) {
      alert("Please enter team number and team name.");
      return;
    }

    const parsedTeamNumber = Number(teamNumber);

    if (!Number.isInteger(parsedTeamNumber) || parsedTeamNumber < 1) {
      alert("Please enter a valid team number.");
      return;
    }

    setIsSaving(true);

    const cleanedMembers = members
      .map((member) => member.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from("teams")
      .insert({
        team_number: parsedTeamNumber,
        team_name: teamName.trim(),
        member_1: cleanedMembers[0] || null,
        member_2: cleanedMembers[1] || null,
        member_3: cleanedMembers[2] || null,
        member_4: cleanedMembers[3] || null,
        member_5: cleanedMembers[4] || null,
        started_at: new Date().toISOString(),
        status: "round_1",
      })
      .select("id, team_number, team_name, member_1, member_2, member_3, member_4, member_5")
      .single();

    setIsSaving(false);

    if (error) {
      console.error("Team creation error:", error);
      alert("Could not save team details. Please try again.");
      return;
    }

    const savedMembers = [
      data.member_1,
      data.member_2,
      data.member_3,
      data.member_4,
      data.member_5,
    ].filter(Boolean);

    onStart({
      id: data.id,
      teamNumber: data.team_number,
      teamName: data.team_name,
      members: savedMembers,
    });
  };

  return (
    <div className="team-details-page">
      <div className="team-details-card">
        <div className="team-details-icon">
          <Anchor size={28} />
        </div>

        <p className="eyebrow">⚓ TECHNITUDE PRESENTS ⚓</p>

        <h1>TEAM DETAILS</h1>

        <p className="team-details-subtitle">
          Assemble your crew before setting sail.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="team-input-group">
            <label htmlFor="team-number">TEAM NUMBER</label>

            <input
              id="team-number"
              type="number"
              min="1"
              placeholder="01"
              value={teamNumber}
              onChange={(event) => setTeamNumber(event.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="team-input-group">
            <label htmlFor="team-name">TEAM NAME</label>

            <input
              id="team-name"
              type="text"
              placeholder="Tech Pirates"
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              disabled={isSaving}
            />
          </div>

          <div className="members-heading">
            <Users size={18} />
            <span>CREW MEMBERS</span>
          </div>

          <div className="members-grid">
            {members.map((member, index) => (
              <div className="team-input-group" key={index}>
                <label htmlFor={`member-${index}`}>
                  MEMBER {String(index + 1).padStart(2, "0")}
                </label>

                <input
                  id={`member-${index}`}
                  type="text"
                  placeholder={`Crew member ${index + 1}`}
                  value={member}
                  onChange={(event) =>
                    updateMember(index, event.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="sail-button team-start-button"
            disabled={isSaving}
          >
            <span>{isSaving ? "SETTING SAIL..." : "START VOYAGE"}</span>
            <span>→</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeamDetails;