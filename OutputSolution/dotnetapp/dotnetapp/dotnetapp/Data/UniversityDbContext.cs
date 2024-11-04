using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Data
{
    public class UniversityDbContext : DbContext
    {
        public DbSet<Department> Departments { get; set; }
        public DbSet<Professor> Professors { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasMany(d => d.Professors)
                    .WithOne(p => p.Department)
                    .HasForeignKey(d => d.DepartmentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}