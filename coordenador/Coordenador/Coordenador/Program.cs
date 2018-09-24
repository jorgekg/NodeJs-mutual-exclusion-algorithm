using Coordenador.Controller;
using System.Threading;

namespace Coordenador
{
    class Program
    {
        static void Main(string[] args)
        {
            var proc = new ProcessarController();
            Thread t1 = new Thread(proc.processar);
            t1.Start();
            Thread t2 = new Thread(proc.removeCoordenador);
            t2.Start();
        }
    }
}
