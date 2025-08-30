package studentrequests

import (
	"bitresume/config"
	facultymodel "bitresume/models/faculty"
	"fmt"
)

func GetProjects() ([]facultymodel.Varification, error) {
	var projects []facultymodel.Varification

	query := `
	SELECT
    p.id,
    p.upload_type,
    p.title_idea,
    p.summary,
    p.problem_statement,
    p.objective,
    p.start_time,
    p.end_time,
    p.is_team_project,
    p.consulted_mentor,
    p.approval_status,
    pf.github_link,
    pf.report_pdf,
    pf.demo_video,
    pp.presented_externally,
    pp.awards_won,
    GROUP_CONCAT(DISTINCT ptm.rollno ORDER BY ptm.rollno SEPARATOR ', ') AS rollnos,
    GROUP_CONCAT(DISTINCT ptm.member_name ORDER BY ptm.member_name SEPARATOR ', ') AS member_names,
    GROUP_CONCAT(DISTINCT ptm.department ORDER BY ptm.department SEPARATOR ', ') AS departments,
    GROUP_CONCAT(DISTINCT pts.tech_name ORDER BY pts.tech_name SEPARATOR ', ') AS tech_names,
    l.user_name
FROM projects AS p
LEFT JOIN login AS l ON p.rollno = l.rollno
LEFT JOIN project_evaluation AS pe ON pe.project_id = p.id
LEFT JOIN project_files AS pf ON pf.project_id = p.id
LEFT JOIN project_presentations AS pp ON pp.project_id = p.id
LEFT JOIN project_team_members AS ptm ON ptm.project_id = p.id
LEFT JOIN project_tech_stack AS pts ON pts.project_id = p.id
GROUP BY
    p.id,
    p.upload_type,
    p.title_idea,
    p.summary,
    p.problem_statement,
    p.objective,
    p.start_time,
    p.end_time,
    p.is_team_project,
    p.consulted_mentor,
    p.approval_status,
    pf.github_link,
    pf.report_pdf,
    pf.demo_video,
    pp.presented_externally,
    pp.awards_won,
    l.user_name;

	`

	rows, err := config.DB.Query(query)
	if err != nil {
		fmt.Println("Error: ", err.Error())
		fmt.Println("Could not get the data from projects for varifiations")
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var r facultymodel.Varification
		err = rows.Scan(
			&r.Id,                  // p.id
			&r.UploadType,          // p.upload_type
			&r.TitleIdea,           // p.title_idea
			&r.Summary,             // p.summary
			&r.ProblemStatement,    // p.problem_statement
			&r.Objective,           // p.objective
			&r.StartTime,           // p.start_time
			&r.EndTime,             // p.end_time
			&r.IsTeamProject,       // p.is_team_project
			&r.ConsultedMentor,     // p.consulted_mentor
			&r.Approval_status,     // p.approval_status
			&r.GithubLink,          // pf.github_link
			&r.ReportPdf,           // pf.report_pdf
			&r.DemoVideo,           // pf.demo_video
			&r.PresentedExternally, // pp.presented_externally
			&r.AwardsWon,           // pp.awards_won
			&r.Rollno,              // GROUP_CONCAT ptm.rollno
			&r.MemberName,          // GROUP_CONCAT ptm.member_name
			&r.Department,          // GROUP_CONCAT ptm.department
			&r.TechNames,
			&r.User_name,
		)
		if err != nil {
			fmt.Println("Error: ", err.Error())
			fmt.Println("Could not scan the code for projects in varifications")
			return nil, err
		}
		projects = append(projects, r)
	}

	return projects, nil
}