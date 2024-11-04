using System;

namespace dotnetapp.Exceptions
{
    public class RankingException : Exception
    {
        public RankingException(string message) : base(message)
        {
        }
    }
}