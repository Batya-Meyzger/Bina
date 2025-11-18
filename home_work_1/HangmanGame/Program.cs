using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HangmanGame
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string[] words = { "apple", "banana", "orange", "grape", "lemon" };
            Random rnd = new Random();
            string word = words[rnd.Next(words.Length)];

            HashSet<char> correct = new HashSet<char>();
            HashSet<char> wrong = new HashSet<char>();

            while (true)
            {
                Console.Clear();
                Console.WriteLine("Hangman Game\n");

                // הצגת המילה עם קווים תחתיים
                string display = string.Concat(word.Select(c => correct.Contains(c) ? c : '_'));
                Console.WriteLine(display);

                // הצגת ניחושים שגויים
                Console.WriteLine("\nWrong guesses: " + string.Join(", ", wrong));

                // בדיקת סיום משחק
                if (!display.Contains('_'))
                {
                    Console.WriteLine("\nYou won! The word was: " + word);
                    break;
                }

                // קלט מהמשתמש
                Console.Write("\nGuess a letter: ");
                char input = Console.ReadLine().ToLower()[0];

                if (word.Contains(input))
                {
                    correct.Add(input);
                }
                else
                {
                    wrong.Add(input);
                }
            }

            Console.WriteLine("\nPress any key to exit...");
            Console.ReadKey();
        }
    }
    }

