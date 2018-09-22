using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.SelfHost;

namespace exclusao_mutua_server
{
    class Program
    {
        static readonly Uri _baseAddress = new Uri("http://localhost:4205/");
        static void Main(string[] args)
        {
            // Set up server configuration
            HttpSelfHostConfiguration config = new HttpSelfHostConfiguration(_baseAddress);
            config.EnableCors();
            config.Routes.MapHttpRoute(
              name: "exclusao",
              routeTemplate: "api/{controller}/{fields}",
              defaults: new { fields = RouteParameter.Optional }
            );

            var appXmlType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(t => t.MediaType == "application/xml");
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(appXmlType);

            // Create server
            var server = new HttpSelfHostServer(config);
            Console.WriteLine("A API está online no host: " + _baseAddress + " pressione qualquer tecla para parar....");
            // Start listening
            server.OpenAsync().Wait();
            Console.ReadLine();
            server.CloseAsync().Wait();
        }
    }
}
