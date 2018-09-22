using exclusao_mutua_server.Model;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;

namespace exclusao_mutua_server.Controller
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CoodController: ApiController
    {

        private List<dynamic> removed = new List<dynamic>();
        private List<Request> pending = new List<Request>();

        public CoodController()
        {
            Thread t = new Thread(new ThreadStart(removeCoordenador));
            t.Start();
            Thread t1 = new Thread(new ThreadStart(run));
            t1.Start();
        }

        public List<dynamic> Get(string fields = null)
        {
            return this.removed;
        }

        [HttpPost]
        public void Post()
        {
            var request = Newtonsoft.Json.JsonConvert.DeserializeObject<Request>(this.Request.Content.ReadAsStringAsync().Result);
            request.create = DateTime.Now;
            Console.WriteLine("Adicionado o processo " + request.id);
            this.pending.Add(request);
        }

        private void run()
        {
            while (true)
            {
                try
                {
                    foreach (var request in pending)
                    {
                        Random rd = new Random();
                        var number = rd.Next(5, 15);
                        Console.WriteLine("Requests " + request.id + " Levará " + number);
                        Thread.Sleep(number * 1000);
                        Console.WriteLine("Concluido Requests " + request.id);
                        pending.Remove(request);
                        break;
                    }
                }
                catch (Exception e)
                {

                }
            }
        }

        private void removeCoordenador()
        {
            while (true)
            {
                Thread.Sleep(60000);
                Console.WriteLine("Coordenador está morto");
                if (pending.Count > 0)
                {
                    removed.AddRange(pending);
                    pending = new List<Request>();
                }
            }
        }
    }
}
