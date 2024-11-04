using System.Collections_Generic;

public class Department
{
    public int DepartmentId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public ICollection<Professor> Professors { get; set; }
}

public class Professor
{
    public int ProfessorId { get; set; }
    public string Name { get; set; }
    public decimal Ranking { get; set; }
    public int DepartmentId { get; set; }
    public Department Department { get; set; }
}