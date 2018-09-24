using exclusao_mutua_server.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;

namespace exclusao_mutua_server.Controller
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CoodController: ApiController
    {

        private DatabaseController db = new DatabaseController();

        public List<Request> Get(string fields = null)
        {
            return db.Get<Request>("request", " and status=2");
        }

        [HttpPost]
        public Request Post()
        {
            var request = new Request();
            request.create_at = DateTime.Now;
            Console.WriteLine("Adicionado o processo " + request.id);
            db.insert<Request>("request", request);
            var data = db.Get<Request>("request");
            return data.FirstOrDefault();
        }
    }
}
