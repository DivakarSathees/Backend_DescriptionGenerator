
namespace dotnetapp.Models{
    public class Speaker{
        public int SpeakerId { get; set; } 
        public string Name { get; set; } 
        public string Bio { get; set; } 
        public ICollection<Talk> Talks { get; set; } 
    }
}

namespace dotnetapp.Models{
    public class Talk{
        public int TalkId { get; set; } 
        public string Title { get; set; } 
        public decimal Duration { get; set; } 
        public int SpeakerId { get; set; } 
        public Speaker Speaker { get; set; } 
    }
}