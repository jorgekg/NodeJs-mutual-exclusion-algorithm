

using Coordenador.Model;
using System;
using System.Linq;
using System.Threading;

namespace Coordenador.Controller
{
    class ProcessarController
    {
        private DatabaseController db = new DatabaseController();

        public void processar()
        {
            while(true)
            {
                var req = db.Get<Request>("request", " and status=0").FirstOrDefault();
                if (req != null)
                {
                    req.status = 1;
                    db.update<Request>("request", req.id.Value, req);
                    var rand = new Random();
                    var numb = rand.Next(5, 15);
                    Console.WriteLine("Processando levando " + numb);
                    Thread.Sleep(numb * 1000);
                }
            }
        }

        public void removeCoordenador()
        {
            while (true)
            {
                var req = db.Get<Request>("request", " and status=0");
                if (req != null)
                {
                    foreach(var r in req)
                    {
                        r.status = 2;
                        db.update<Request>("request", r.id.Value, r);
                    }
                }
                Console.WriteLine("Coordenador removido");
                Thread.Sleep(60000);
            }
        }
    }
}
